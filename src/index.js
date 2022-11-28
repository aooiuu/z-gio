#! /usr/bin/env node

import { Command } from 'commander';
import { GIO } from './action.js';

const program = new Command();

const gio = new GIO();

program
  .command('export')
  .description('原始数据导出')
  .option('--data-type <dataType>', '导出事件类型', 'custom_event')
  .option('--export-type <exportType>', '导出任务类型，系统目前支持小时与天的导出，可选值：hour 或者 day', 'hour')
  .option('--export-date <exportDate>', '导出数据北京时间，格式为 yyyyMMddHHmm, 表现请求导出哪段时间内的数据')
  .option('--out-path <outPath>', '输出路径')
  .option('--ai <ai>', '项目ID')
  .option('--authorization <authorization>', '接口请求所需的认证码，即 Token')
  .action((source) => {
    gio.export(source);
  });

program
  .command('find')
  .description('查找埋点事件数据')
  .option('--data-type <dataType>', '导出事件类型', 'custom_event')
  .option('--export-type <exportType>', '导出任务类型，系统目前支持小时与天的导出，可选值：hour 或者 day', 'hour')
  .option('--export-date <exportDate>', '导出数据北京时间，格式为 yyyyMMddHHmm, 表现请求导出哪段时间内的数据')
  .option('--out-path <outPath>', '输出路径')
  .option('--ai <ai>', '项目ID')
  .option('--authorization <authorization>', '接口请求所需的认证码，即 Token')
  .option('--event-id <eventId>', '埋点事件标识')
  .action((source) => {
    gio.find(source);
  });

program
  .command('bind')
  .description('绑定参数')
  .option('--ai <ai>', '项目ID')
  .option('--authorization <authorization>', '接口请求所需的认证码，即 Token')
  .action((source) => {
    gio.bind(source);
  });

program
  .command('track')
  .description('埋点数据上传')
  .option('--event-id <eventId>', '埋点事件标识')
  .option('--data <data>', '所有的自定义事件变量')
  .action((source) => {
    gio.track(source);
  });

program.parse(process.argv);
