/** Locale-aware formatter for date-only locker assignment fixtures. */
export function formatAdminLockersDate(value: string, locale: string): string {
 if (!value || value === '—') return '—';
 const iso=/^(\d{4})-(\d{2})-(\d{2})$/.exec(value.trim());
 const legacy=/^(\d{1,2}) ([A-Z][a-z]{2}) (\d{4})$/.exec(value.trim());
 let year:number, month:number, day:number;
 if(iso){year=Number(iso[1]);month=Number(iso[2]);day=Number(iso[3]);}
 else if(legacy){const months:Record<string,number>={Jan:1,Feb:2,Mar:3,Apr:4,May:5,Jun:6,Jul:7,Aug:8,Sep:9,Oct:10,Nov:11,Dec:12};year=Number(legacy[3]);month=months[legacy[2]??'']??0;day=Number(legacy[1]);}
 else return '—';
 const date=new Date(Date.UTC(year,month-1,day));
 if(!month||date.getUTCFullYear()!==year||date.getUTCMonth()!==month-1||date.getUTCDate()!==day)return '—';
 return new Intl.DateTimeFormat(locale==='hi'?'hi-IN':'en-IN',{year:'numeric',month:'short',day:'numeric',timeZone:'UTC'}).format(date);
}
