# z-gio

> growingio 命令行工具

## 功能

- 原始数据导出
  - 下载数据报表并解压
  - 下载缓存
- 埋点数据上传
- 验证埋点事件

## 安装

```sh
npm install -g z-gio
```

## 例子

### 通用

```sh
# 执行 bind 绑定参数, 后面就不用每次都写 authorization 和 ai 了
zgio bind --ai xxx --authorization xxxxx
```

**参数说明**

> 参数大多和官网保持一致

[growingio - API 参考](https://growingio.gitbook.io/v3/developer-manual/api-reference/authenticate)

| 名称          | 说明                           |
| ------------- | ------------------------------ |
| authorization | 接口请求所需的认证码，即 Token |
| ai            | 项目 ID                        |

### 下载报表

```sh
# 下载 2022112714 时间段的报表 并解压
zgio export --export-date 2022112714

# 下载 2022112714至2022112723 时间段的报表 并解压
zgio export --export-date 2022112714-2022112723

# 下载 2022112714 时间段的报表 并解压
zgio export --export-date 2022112714 --ai xxx --authorization xxx --export-type hour --data-type custom_event
```

**参数说明**

> 参数大多和官网保持一致

[growingio - API 参考](https://growingio.gitbook.io/v3/developer-manual/api-reference/authenticate)

| 名称          | 说明                                                                    |    默认值    |
| ------------- | ----------------------------------------------------------------------- | :----------: |
| authorization | 接口请求所需的认证码，即 Token                                          |              |
| ai            | 项目 ID                                                                 |              |
| data_type     | 导出事件类型                                                            | custom_event |
| export_type   | 导出任务类型，系统目前支持小时与天的导出，可选值：hour 或者 day         |     hour     |
| export_date   | 导出数据时间，格式为 yyyyMMddHH (支持配置时段如: 2022112000-2022112023) |              |

### 埋点数据上传

```sh
zgio track --event-id xxx
zgio track --event-id xxx --data "{\"a\": 1}"
```

**参数说明**

> 参数大多和官网保持一致

[growingio - API 参考](https://growingio.gitbook.io/v3/developer-manual/api-reference/authenticate)

| 名称          | 说明                                                                    |    默认值    |
| ------------- | ----------------------------------------------------------------------- | :----------: |
| authorization | 接口请求所需的认证码，即 Token                                          |              |
| ai            | 项目 ID                                                                 |              |
| data_type     | 导出事件类型                                                            | custom_event |
| export_type   | 导出任务类型，系统目前支持小时与天的导出，可选值：hour 或者 day         |     hour     |
| export_date   | 导出数据时间，格式为 yyyyMMddHH (支持配置时段如: 2022112000-2022112023) |              |
| event-id      | 埋点事件标识                                                            |              |
| data          | 所有的自定义事件变量                                                    |              |

### 验证埋点事件

> 用来快速验证埋点数据是否存在

```sh
zgio find --event-id xxx --export-date 2022112714
```

**参数说明**

> 参数大多和官网保持一致

[growingio - API 参考](https://growingio.gitbook.io/v3/developer-manual/api-reference/authenticate)

| 名称          | 说明                                                                    |    默认值    |
| ------------- | ----------------------------------------------------------------------- | :----------: |
| authorization | 接口请求所需的认证码，即 Token                                          |              |
| ai            | 项目 ID                                                                 |              |
| data_type     | 导出事件类型                                                            | custom_event |
| export_type   | 导出任务类型，系统目前支持小时与天的导出，可选值：hour 或者 day         |     hour     |
| export_date   | 导出数据时间，格式为 yyyyMMddHH (支持配置时段如: 2022112000-2022112023) |              |
| event-id      | 埋点事件标识                                                            |              |
