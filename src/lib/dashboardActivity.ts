export type DashboardRecord={id:string;unitId:string;title:string;recordLabel:string;updatedAt:string;status:'recorded'|'pending'|'returned';preview:{label:string;value:string}[]};
export type DashboardReport={id:string;unitId:string;title:string;period:string;createdAt:string;status:'submitted'|'reviewed'|'returned';attachmentCount:number;summary:string};
export type DashboardActivity={recordCount:number;pendingRecordCount:number;reportCount:number;reportsAwaitingReview:number;records:DashboardRecord[];reports:DashboardReport[]};
