'use client';
/** Responsibility: renders the shell command palette and keyboard-shortcut help; state, search, listeners, and focus lifecycle are owned by its module hook. */
/** Data-Flow: shell command-palette hook and canonical route registry -> keyboard/search state -> filtered command list -> selected route navigation; no business API request is performed. */
import { CornerDownLeft, Keyboard, Search, X } from 'lucide-react';
import { useSuperadminNavigationShellCommandPalette } from '@/app/frontend_superadmin/superadmin_navigation/navigation_shell/hooks/useSuperadminNavigationShellCommandPalette';
/**
 * Performs the superadmin navigation shell command palette operation within the Superadmin navigation shell; inputs and outputs follow the declared TypeScript contract.
 */
export default function SuperadminNavigationShellCommandPalette() {
  const { t, isOpen, isShortcutsOpen, query, setQuery, activeIndex, setActiveIndex, results, inputRef, shortcutsCloseRef, closePalette, closeShortcuts, selectResult, handleInputKeyDown, trapDialogFocus } = useSuperadminNavigationShellCommandPalette();

  return (
    <>
      {isOpen && (
        <div className="sa-command-palette-overlay" onMouseDown={(event) => { if (event.target === event.currentTarget) closePalette(); }}>
          <section className="sa-command-palette-dialog" role="dialog" aria-modal="true" aria-labelledby="superadmin-command-palette-title" aria-describedby="superadmin-command-palette-help" onKeyDown={trapDialogFocus} data-testid="superadmin-superadmin-navigation-shell-command-palette-section-line-12">
            <h2 id="superadmin-command-palette-title" className="sr-only">{t('COPY.GLOBAL_COMMAND_PALETTE')}</h2>
            <div className="sa-command-palette-search-row">
              <Search size={19} aria-hidden="true" className="text-secondary shrink-0" />
              <input
                ref={inputRef}
                type="search"
                value={query}
                onChange={(event) => { setQuery(event.target.value); setActiveIndex(0); }}
                onKeyDown={handleInputKeyDown}
                placeholder={t('COPY.SEARCH_OR_JUMP_TO')}
                aria-label={t('COPY.SEARCH_OR_JUMP_TO')}
                role="combobox"
                aria-autocomplete="list"
                aria-haspopup="listbox"
                aria-expanded={isOpen}
                aria-controls="superadmin-command-palette-results"
                aria-activedescendant={results[activeIndex] ? `superadmin-command-option-${activeIndex}` : undefined}
                autoComplete="off"
               data-testid="superadmin-navigation-command-palette-search-or-jump-to-1"/>
              <button type="button" className="sa-btn-icon" onClick={closePalette} aria-label={t('COPY.CLOSE')} title={t('COPY.CLOSE')} data-testid="superadmin-navigation-command-palette-close-2">
                <X size={17} aria-hidden="true" />
              </button>
            </div>
            <p id="superadmin-command-palette-help" className="sa-command-palette-hint">{t('COPY.COMMAND_PALETTE_KEYBOARD_HINT')}</p>
            <div id="superadmin-command-palette-results" className="sa-command-palette-results" role="listbox" aria-label={t('COPY.PAGES')}>
              {results.map((item, index) => {
                
                return (
                  <button
                    id={`superadmin-command-option-${index}`}
                    key={item.href}
                    type="button"
                    role="option"
                    aria-selected={activeIndex === index}
                    className={`sa-command-palette-option${activeIndex === index ? ' sa-command-palette-option--active' : ''}`}
                    onMouseEnter={() => setActiveIndex(index)}
                    onClick={() => selectResult(item.href)}
                   data-testid={`superadmin-navigation-command-palette-select-result-3-${String(item.href)}`}>
                    <item.icon size={17} aria-hidden="true" />
                    <span>{t(item.labelKey)}</span>
                    <span className="sa-command-palette-option-path">{item.href}</span>
                    {activeIndex === index && <CornerDownLeft size={15} aria-hidden="true" className="ml-auto" />}
                  </button>
                );
              })}
            </div>
            {results.length === 0 && <p className="sa-command-palette-empty" role="status">{t('COPY.NO_PAGES_FOUND')}</p>}
          </section>
        </div>
      )}
      {isShortcutsOpen && (
        <div className="sa-command-palette-overlay" onMouseDown={(event) => { if (event.target === event.currentTarget) closeShortcuts(); }}>
          <section className="sa-shortcuts-dialog" role="dialog" aria-modal="true" aria-labelledby="superadmin-shortcuts-title" onKeyDown={trapDialogFocus} data-testid="superadmin-superadmin-navigation-shell-command-palette-section-line-61">
            <div className="sa-shortcuts-heading">
              <Keyboard size={20} aria-hidden="true" />
              <h2 id="superadmin-shortcuts-title">{t('COPY.KEYBOARD_SHORTCUTS')}</h2>
              <button ref={shortcutsCloseRef} type="button" className="sa-btn-icon ml-auto" onClick={closeShortcuts} aria-label={t('COPY.CLOSE')} data-testid="superadmin-navigation-command-palette-close-4"><X size={17} aria-hidden="true" /></button>
            </div>
            <dl className="sa-shortcuts-list">
              <div><dt>{t('COPY.OPEN_COMMAND_PALETTE')}</dt><dd><kbd>Ctrl</kbd> + <kbd>K</kbd></dd></div>
              <div><dt>{t('COPY.SUBMIT_ACTIVE_FORM')}</dt><dd><kbd>Ctrl</kbd> + <kbd>S</kbd></dd></div>
              <div><dt>{t('COPY.SHOW_KEYBOARD_SHORTCUTS')}</dt><dd><kbd>?</kbd></dd></div>
              <div><dt>{t('COPY.CLOSE_DIALOG_OR_MENU')}</dt><dd><kbd>Esc</kbd></dd></div>
            </dl>
          </section>
        </div>
      )}
    </>
  );
}
