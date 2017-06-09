/**
 * 小程序配置文件
 */

// 此处主机域名修改成腾讯云解决方案分配的域名
var host = '43475800.qcloud.la';

var config = {
  appid: '',
  secret: '',

  service: {
    host,

    // 登录地址，用于建立会话
    loginUrl: `https://${host}/login`,
    // 检查是否存在房间
    checkRoomUrl: `https://${host}/api/checkroom`,
    // 创建房间
    createUrl: `https://${host}/api/create`,
    // 歌曲列表
    getSongsUrl: `https://${host}/api/getsongs`,
    // 加入房间
    joinUrl: `https://${host}/api/join`,
    // 更新状态
    updateStatusUrl: `https://${host}/api/updatestatus`,
    // 同步状态
    syncUrl: `https://${host}/api/sync`,

    socketUrl: `wss://${host}/socket`,
  }
};

module.exports = config;
