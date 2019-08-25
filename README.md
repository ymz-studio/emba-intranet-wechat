# 如何打通微信公账号与系统

利用微信公众平台的开放接口，我们可以实现系统与微信公众平台服务器的双向通信，充分利用微信公众平台提供的功能。

## 名词解释

* userID: 用户在我们系统中的唯一标识，在信息录入时生成，一经确定无法修改；
* openID: 用户在微信公众平台的唯一标识；
* accessToken: 访问微信公众平台服务器时所需要携带的令牌；

## 功能实现

首先，我们要完成我们服务器与微信服务器之间的认证和握手，确保可以建立安全有效的连接。我们在公众号的后台配置一个秘钥，当我们的服务器接收到微信服务器发来的消息时，我们通过将参数与秘钥组合进行加密后与微信发来的哈希值相同，即可认为消息确实来自于微信服务器。

同样的，微信服务器也需要识别我们的服务器，通过配置约定好的appID和appSecret，请求特定的接口获得accessToken，在发送请求时携带accessToken即可。

以下是接收微信请求时的验证过程：

![img](https://ipic-1253962968.cos.ap-beijing.myqcloud.com/2019-08-25-144537.jpg)

由于获取accessToken的接口有调用次数限制，且token存在时效性。我们需要自己建立起一套缓存机制，保证开发资源的有效利用。

以下是获取accessToken的流程：

![zenuml (https://ipic-1253962968.cos.ap-beijing.myqcloud.com/2019-08-25-150510.jpg)](/Users/wsq/Downloads/zenuml (4).jpeg)

有了上述两种机制作为基础，我们就可以顺利的接收微信服务器的消息或者向微信服务器发送消息。

### 扫码绑定

我们要确定userID和openID之间的映射关系。通过生成**带参数的公众号二维码**，在二维码中携带用户的身份令牌，用户扫码关注公众号后，微信服务器会发送一条消息至我们的服务器，携带用户令牌和openID，服务器通过解析令牌即可确立userID和openID的映射关系。

![zenuml (https://ipic-1253962968.cos.ap-beijing.myqcloud.com/2019-08-25-151510.jpg)](/Users/wsq/Downloads/zenuml (5).jpeg)



### 扫码登录

获取二维码的过程与扫码绑定类似，主要阐述一下登录的流程。用户在登录页面请求二维码并扫描，微信服务器收到扫码事件后会携带用户openID请求我们的服务器，服务器判断openID是否已经绑定过，如果没有则提示用户无法登录，如果有则设置用户的登录状态并重定向客户端的页面。![zenuml (https://ipic-1253962968.cos.ap-beijing.myqcloud.com/2019-08-25-153647.jpg)](/Users/wsq/Downloads/zenuml (9).jpeg)

### 公众号通知

我们平台的通知产生时，可以被发送给微信服务器，通过公众号发送给用户。通过给通知配置链接，还可以让用户在微信内直接打开系统页面。

![zenuml (https://ipic-1253962968.cos.ap-beijing.myqcloud.com/2019-08-25-153556.jpg)](/Users/wsq/Downloads/zenuml (8).jpeg)


