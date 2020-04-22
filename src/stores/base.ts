/*
 * @文件描述:
 * @公司: thundersdata
 * @作者: 陈杰
 * @Date: 2019-10-27 17:10:00
 * @LastEditors: 廖军
 * @LastEditTime: 2020-04-22 09:48:33
 */
import { BaseStore } from '@/interfaces/base.store';
import { MenuItemConfig } from '@/interfaces/common';

const baseStore: BaseStore = {
  menus: [
    {
      name: '首页',
      link: '/',
      icon: 'iconhomepage',
      children: [],
    },
    {
      name: '子应用',
      link: '/purehtml',
      icon: 'iconhomepage',
      children: [],
    },
  ],
  privileges: [],

  // methods
  setMenus(menus: MenuItemConfig[]) {
    this.menus = menus;
  },
  setPrivileges(privileges: string[]) {
    this.privileges = privileges;
  },
};

export default baseStore;
