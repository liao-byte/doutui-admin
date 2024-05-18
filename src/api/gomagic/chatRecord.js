import request from "@/utils/request";

 export function getChatRecordAllNumAndNewAdd(day){
    return request({
        url: `/gomagic/chatRecord/getAllNumAndNewAdd?day=${day}`,
        method: 'get',
    })
}
