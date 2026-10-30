import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const root = path.resolve(process.cwd());
const expectedLeafCount = 67;
const errors = [];
const isDirectory = async (candidate) => {
  try {
    return (await stat(candidate)).isDirectory();
  } catch {
    return false;
  }
};

const domains = (await readdir(root, { withFileTypes: true }))
  .filter((entry) => entry.isDirectory() && entry.name.startsWith('admin_'));
const leaves = [];
for (const domain of domains) {
  const domainPath = path.join(root, domain.name);
  const children = await readdir(domainPath, { withFileTypes: true });
  for (const child of children.filter((entry) => entry.isDirectory())) {
    const leaf = path.join(domainPath, child.name);
    const featureDocs = (await readdir(leaf, { withFileTypes: true }))
      .filter((entry) => entry.isFile() && entry.name.endsWith('_features.md'));
    if (featureDocs.length > 0) {
      leaves.push({ domain: domain.name, name: child.name, path: leaf, featureDoc: path.join(leaf, featureDocs[0].name) });
    }
  }
}

if (leaves.length !== expectedLeafCount) {
  errors.push(`Expected ${expectedLeafCount} documented module/support leaves from ${root}; found ${leaves.length}. Run from frontend_admin/.`);
}

const rootOwners = new Map();
let verified = 0;
for (const leaf of leaves) {
  const modulePath = `${leaf.domain}/${leaf.name}`;
  const apiPath = path.join(leaf.path, 'api');
  if (!await isDirectory(apiPath)) {
    errors.push(`${modulePath}: missing api/ directory`);
    continue;
  }

  const files = (await readdir(apiPath, { withFileTypes: true }))
    .filter((entry) => entry.isFile() && entry.name.endsWith('.query_keys.ts'));
  if (files.length !== 1) {
    errors.push(`${modulePath}: expected exactly one dedicated *.query_keys.ts file in api/; found ${files.length}`);
    continue;
  }

  const leafPrefix = leaf.name.toLowerCase().startsWith('admin_') ? leaf.name.toLowerCase() : `admin_${leaf.name.toLowerCase()}`;
  const expectedFile = `${leafPrefix}.query_keys.ts`;
  if (files[0].name !== expectedFile) {
    errors.push(`${modulePath}: expected canonical filename ${expectedFile}; found ${files[0].name}`);
  }

  const registryPath = path.join(apiPath, files[0].name);
  const source = await readFile(registryPath, 'utf8');
  const exportMatch = source.match(/export\s+const\s+([A-Z][A-Z0-9_]+)\s*=/);
  const rootMatch = source.match(/\ball\s*:\s*\[\s*(['"])([^'"]+)\1\s*\]\s+as const/);
  if (!exportMatch) errors.push(`${modulePath}: query-key registry must export a named constant`);
  if (exportMatch?.[1].startsWith('ADMIN_ADMIN_')) errors.push(`${modulePath}: query-key export has a duplicated ADMIN prefix`);
  if (!rootMatch) errors.push(`${modulePath}: ` + 'all' + ` must begin with one literal, namespaced root tuple`);
  if (rootMatch?.[2].startsWith('admin_admin_')) errors.push(`${modulePath}: query-key root has a duplicated admin prefix`);

  const requiredMembers = ['lists:', 'list:', 'details:', 'detail:'];
  const absentMembers = requiredMembers.filter((member) => !source.includes(member));
  if (absentMembers.length) errors.push(`${modulePath}: missing canonical factory member(s): ${absentMembers.join(', ')}`);
  if (!/lists\s*:\s*\(\)\s*=>\s*\[\s*\.\.\.\s*[A-Z][A-Z0-9_]*\.all\s*,\s*['\"]list['\"]\s*\]/.test(source)) errors.push(`${modulePath}: lists must append the canonical 'list' discriminator to all`);
  if (!/list\s*:\s*\(\s*filters\??\s*:\s*Readonly<\s*Record</.test(source) || !/\.lists\(\)[\s\S]*?filters/.test(source)) errors.push(`${modulePath}: list must carry filters under the module-owned lists prefix`);
  if (!/details\s*:\s*\(\)\s*=>\s*\[\s*\.\.\.\s*[A-Z][A-Z0-9_]*\.all\s*,\s*['\"]detail['\"]\s*\]/.test(source)) errors.push(`${modulePath}: details must append the canonical 'detail' discriminator to all`);
  if (!/detail\s*:\s*\(\s*resourceId\s*:\s*string\s*\)\s*=>\s*\[\s*\.\.\.\s*[A-Z][A-Z0-9_]*\.details\(\)\s*,\s*resourceId\s*\]/.test(source)) errors.push(`${modulePath}: detail must include an explicit resourceId under details()`);

  if (rootMatch) {
    const cacheRoot = rootMatch[2];
    const priorOwner = rootOwners.get(cacheRoot);
    if (priorOwner && priorOwner !== modulePath) errors.push(`Duplicate query-cache root ${cacheRoot}: ${priorOwner} and ${modulePath}`);
    else rootOwners.set(cacheRoot, modulePath);
  }

  const featureDoc = await readFile(leaf.featureDoc, 'utf8');
  const sectionStart = featureDoc.indexOf('## 5. Query Key Registry');
  const sectionEnd = featureDoc.indexOf('## 6. Mutation Inventory', sectionStart + 1);
  if (sectionStart < 0 || sectionEnd < 0) {
    errors.push(`${modulePath}: feature spec missing bounded section 5 Query Key Registry`);
  } else {
    const section = featureDoc.slice(sectionStart, sectionEnd);
    if (!section.includes(`api/${expectedFile}`)) errors.push(`${modulePath}: feature spec does not name api/${expectedFile}`);
    if (exportMatch && !section.includes(exportMatch[1])) errors.push(`${modulePath}: feature spec does not name registry export ${exportMatch[1]}`);
    if (rootMatch && !section.includes(rootMatch[2])) errors.push(`${modulePath}: feature spec does not name root namespace ${rootMatch[2]}`);
  }
  verified += 1;
}

if (errors.length) {
  process.stderr.write(`Query-key registry check failed (${errors.length} issue(s); ${verified}/${leaves.length} module leaves inspected):\n${errors.map((error) => `- ${error}`).join('\n')}\n`);
  process.exit(1);
}
process.stdout.write(`Query-key registry check passed: ${domains.length} domain/support containers, ${verified} documented leaves, one canonical registry per leaf, documented export/root, canonical factory shape, and ${rootOwners.size} unique cache roots. This is a static contract check; runtime query consumption is not asserted.\n`);
