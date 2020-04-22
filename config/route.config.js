/*
 * @文件描述:
 * @公司: thundersdata
 * @作者: 廖军
 * @Date: 2020-04-21 16:39:43
 * @LastEditors: 廖军
 * @LastEditTime: 2020-04-21 23:24:46
 */
export default [
  {
    path: '/',
    component: '../layouts/BasicLayout',
    routes: [
      {
        path: '/',
        component: './homepage',
      },
      { path: '/purehtml', exact: true, component: './subAppContainer' },
      {
        path: '*',
        component: './404',
      },
    ],
  },
];
