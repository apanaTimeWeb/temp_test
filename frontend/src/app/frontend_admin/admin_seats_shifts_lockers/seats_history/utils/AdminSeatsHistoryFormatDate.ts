/** Localizes demo ISO/display dates while retaining date-only calendar semantics. */
export function formatAdminSeatsDate(value: string, locale: string): string {
 if (!value || value === '—' || value === 'Today' || value === 'Pending') return value || '—';
 let date: Date;
 const iso=/^(\d{4})-(\d{2})-(\d{2})$/.exec(value.trim());
 if(iso) { const y=Number(iso[1]),m=Number(iso[2]),d=Number(iso[3]); date=new Date(Date.UTC(y,m-1,d)); if(date.getUTCFullYear()!==y||date.getUTCMonth()!==m-1||date.getUTCDate()!==d)return '—'; }
 else { const legacy=/^(\d{1,2}) ([A-Z][a-z]{2}) (\d{4})$/.exec(value.trim()); if(!legacy)return '—'; const months:Record<string,number>={Jan:0,Feb:1,Mar:2,Apr:3,May:4,Jun:5,Jul:6,Aug:7,Sep:8,Oct:9,Nov:10,Dec:11}; const m=months[legacy[2]??'']; if(m===undefined)return '—'; date=new Date(Date.UTC(Number(legacy[3]),m,Number(legacy[1]))); if(date.getUTCDate()!==Number(legacy[1]))return '—'; }
 return new Intl.DateTimeFormat(locale==='hi'?'hi-IN':'en-IN',{year:'numeric',month:'short',day:'numeric',timeZone:'UTC'}).format(date);
}
