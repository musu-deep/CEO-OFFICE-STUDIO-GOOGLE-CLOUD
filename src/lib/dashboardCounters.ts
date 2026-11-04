export const dashboardCounterIds=['records','reports','reports-submitted','reports-reviewed','pending-records','open-tasks','overdue-tasks','approved-units','pending-metrics','objectives','decisions'] as const;
export type DashboardCounterId=typeof dashboardCounterIds[number];
export type DashboardCounter={id:DashboardCounterId;label:string;value:number;description:string;emptyMessage:string};
export type DashboardCounterItem={id:string;unitId?:string;title:string;details:string;kind:'record'|'report'|'task'|'unit'|'objective'|'decision'};
