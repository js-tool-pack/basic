import { getTimePeriodConst } from './getTimePeriodConst';
import { formatDate } from './formatDate';

/**
 * 获取过去时间数
 * ---
 * 时间匹配顺序：年、季、月、周、天、时、分、秒
 *
 * @example
 * ```ts
 * const date = new Date('2023/4/7 00:00:00');
 * howLongAgo(date, { now: new Date('2023/4/7 00:00:20') }); // '20秒前'
 * howLongAgo(date, { now: new Date('2023/4/7 00:10:20') }); // '10分钟前'
 * howLongAgo(date, { now: new Date('2023/4/7 08:00:00') }); // '8小时前'
 * howLongAgo(date, { now: new Date('2023/4/10 00:00:00') }); // '3天前'
 *
 * howLongAgo(date, { now: new Date('2023/4/15 00:00:00') }); // '1周前'
 * howLongAgo(date, { now: new Date('2023/5/6 00:00:00') }); // '4周前'
 *
 * howLongAgo(date, { now: new Date('2023/5/7 00:00:00') }); // '1月前'
 * // 因为过去多少月是按天数算的，5月有31天，所以到6月6号已经是2月前了
 * howLongAgo(date, { now: new Date('2023/6/6 00:00:00') }); // '2月前'
 * howLongAgo(date, { now: new Date('2023/7/7 00:00:00') }); // '3月前'
 *
 * // 按天数算的，5月有31天，一季按91.25(365/4)天算
 * howLongAgo(date, { now: new Date('2023/7/8 00:00:00') }); // '1季前'
 *
 * howLongAgo(date, { now: new Date('2024/7/7 00:00:00') }); // '1年前'
 *
 * // now比date小
 * howLongAgo(date, { now: new Date('2022/7/8 00:00:00') }); // '2023-04-07 00:00:00'
 * howLongAgo(date, { now: new Date('2022/7/8 00:00:00'), def: '--' }); // '--'
 * howLongAgo(date, { now: new Date('2022/7/8 00:00:00'), defaultFormat: 'yyyy' }); // '2023'
 *
 * // 更换模板
 * const templates: Required<Parameters<typeof howLongAgo>>[1]['templates'] = {};
 *
 * // 更换秒数模板
 * templates.second = '刚刚';
 * howLongAgo(date, { now: new Date('2023/4/7 00:00:20'), templates }); // '刚刚'
 *
 * // 更换小时数模板
 * templates.hour = '${ago} hours ago';
 * howLongAgo(date, { now: new Date('2023/4/7 08:00:00'), templates }); // '8 hours ago'
 *
 * // 更换周数模板
 * templates.week = '${ago}星期前';
 * howLongAgo(date, { now: new Date('2023/4/15 00:00:00'), templates }); // '1星期前'
 * howLongAgo(date, { now: new Date('2023/5/6 00:00:00'), templates }); // '4星期前'
 *
 * // 去掉周数
 * templates.week = '~~';
 * howLongAgo(date, { now: new Date('2023/4/15 00:00:00'), templates }); // '8天前'
 * howLongAgo(date, { now: new Date('2023/5/6 00:00:00'), templates }); // '29天前'
 *
 * // 去掉季节
 * templates.season = '~~';
 * howLongAgo(date, { now: new Date('2023/7/8 00:00:00'), templates }); // '3月前'
 *
 * // ------- filter -------
 * // 使用filter替换季数
 * howLongAgo(date, {
 *   now: new Date('2023/10/8 00:00:00'),
 *   filter: (res, diff) =>
 *     res.endsWith('季前') ? ~~(diff / getTimePeriodConst().season) + ' seasons ago' : res,
 * }); // '2 seasons ago'
 *
 * // 混合
 * howLongAgo(date, {
 *   now: new Date('2023/4/7 02:10:00'),
 *   filter: (res, diff) => {
 *     if (res.endsWith('小时前')) {
 *       const tpc = getTimePeriodConst();
 *       return `${~~(diff / tpc.hour)}小时${~~((diff % tpc.hour) / tpc.minute)}分钟前`;
 *     }
 *     return res;
 *   },
 * }); // '2小时10分钟前'
 * ```
 *
 * @param date 过去的时间
 * @param {{}} options
 * @param options.now 当前时间；默认为new Date()
 * @param options.defaultFormat def参数${time}插槽的时间格式化模板；默认为'yyyy-MM-dd hh:mm:ss'
 * @param options.def 未匹配到模版时返回的模板，支持${time}插槽；默认为'${time}'
 * @param options.templates 匹配模板，支持${ago}插；当模板字符串为'~~'时会跳过该匹配模板，取自markdown的~~标记；默认为
 * {
 *   year: '${ago}年前',
 *   season: '${ago}季前',
 *   month: '${ago}月前',
 *   week: '${ago}周前',
 *   day: '${ago}天前',
 *   hour: '${ago}小时前',
 *   minute: '${ago}分钟前',
 *   second: '${ago}秒前',
 * }，传入模板时只会替换已填写部分模板
 * @param options.filter 过滤函数
 */
export function howLongAgo(
  date: Date,
  {
    defaultFormat = 'yyyy-MM-dd hh:mm:ss',
    now = new Date(),
    def = '${time}',
    templates,
    filter,
  }: {
    templates?: Partial<
      Record<keyof Omit<ReturnType<typeof getTimePeriodConst>, 'millisecond'> | 'now', string>
    >;
    filter?: (result: string, diff: number) => string;
    defaultFormat?: string;
    def?: string;
    now?: Date;
  } = {},
): string {
  const searchValue = '${ago}';
  const _templates: Required<typeof templates> = {
    minute: `${searchValue}分钟前`,
    season: `${searchValue}季前`,
    second: `${searchValue}秒前`,
    month: `${searchValue}月前`,
    hour: `${searchValue}小时前`,
    year: `${searchValue}年前`,
    week: `${searchValue}周前`,
    day: `${searchValue}天前`,
    now: '刚刚',
    ...templates,
  };
  const timePeriodConst = getTimePeriodConst();
  const matches: Array<[condition: number, template: string]> = (
    ['year', 'season', 'month', 'week', 'day', 'hour', 'minute', 'second'] satisfies Array<
      keyof typeof _templates
    >
  ).map((key) => [timePeriodConst[key], _templates[key]]);
  const _filter = filter || ((result) => result);
  const diff = now.getTime() - date.getTime();
  const found = matches.find(([cond, tpl]) => tpl !== '~~' && diff >= cond);
  if (!found) {
    if (diff >= 0 && diff < 1000) return _filter(_templates.now, diff);
    const res = def.replace('${time}', formatDate(date, defaultFormat));
    return _filter(res, diff);
  }
  const [condition, template] = found;
  const res = template.replace(searchValue, String(Math.floor(diff / condition)));
  return _filter(res, diff);
}
