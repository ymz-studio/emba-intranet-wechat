// 绑定事件参数
interface BundleEventPayload {
    ToUserName: string;
    FromUserName: string;
    CreateTime: string;
    Event: 'subscribe' | 'SCAN',
    EventKey: string;
}