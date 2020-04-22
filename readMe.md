<!--
 * @文件描述: 
 * @公司: thundersdata
 * @作者: 廖军
 * @Date: 2020-04-21 16:39:43
 * @LastEditors: 廖军
 * @LastEditTime: 2020-04-22 10:32:37
 -->
### pont配置
1. 在pont-config.json文件中配置origins，一个swagger地址对应一个name和originUrl，name的命名没有约束，但是会在接口调用的时候用到，例如authorization（权限中心），originUrl就是api-docs的地址，例如'http://xxxx/v2/api-docs'，可以支持配置多个swagger地址，但是注意：除了origins之外的配置项不要改动
2. server.config.js文件是用于从pont-config.json文件中读取后端接口地址的，不需要进行改动（如果随意的更改可能会引起调用接口的时候nameSpace对应不上）
3. pontTemplate.ts文件是定义生成代码的模板文件，不需要进行改动
4. 在项目的入口文件，即src目录下的global.ts文件中加入一句'import '@/services';'，把API引入进来

### pont使用
1. 在 vscode 中安装 vscode 插件 pont，使用方法参考'https://github.com/nefe/vscode-pont'
2. 当vscode-pont检测到项目中含有合法的pont-config.json之后，插件会马上启动生成services文件夹
3. 如果后端接口发生了更新，那么需要手动的点击VS code左下方的sync按钮，这样才会去比较线上和线下的差异实现和服务端同步变更，但是这个变更是存在于内存中的，all/mod/bo都是把对应内容更新到api.lock中，generate是根据lock生成最后的代码
4. 当重新打开项目时，会自动调用一次sync，获取和服务端的差异
5. 目前API已经配置为全局变量，当需要调用接口时，我们不需要再进行import操作，只需要API.[nameSpace].[mod].[方法的文件名].fetch()，nameSpace即在pont-config.json文件中配置的origins的name，mod即是module，例如：API.authorization.role.resourceSave.fetch()
6. 更多细节：'https://github.com/alibaba/pont'

### pont最佳实践
基于我们自定义的pontTemplate，pont已经帮我们生成了我们需要的TypeScript类型声明文件，以及对应的调用后端接口的胶水代码，同时也为我们生成好了初始值。那么我们使用pont的最佳实践应该是什么样的呢？我在这里大致总结一下：
1. 不要自己定义初始值，直接使用pont生成的init值作为useState或者store里面的初始值。例如：
```typescript
const [detail, setDetail] = useState<defs.gazelle.CompanyFinancialIndicatorDTO>(API.gazelle.companyFinancialIndicator.getById.init);
```
2. 用utils/exception-handling 中的`tryCatch`代码块包裹你的业务处理逻辑，出现异常时他会统一给Sentry发送消息。

我们自定义生成的请求方法的格式如下：
```typescript
export async function fetch(params = {}) {
  try {
    const result = await request.get(
      backEndUrl + '/companyFinancialIndicator/getById',
      params,
    );
    if (!result.success) throw result;
    return result;
  } catch (error) {
    throw {
      success: false,
      data: new defs.gazelle.CompanyFinancialIndicatorDTO(),
      message: error.message || '请求失败，请重试',
    };
  }
}
```
你会发现这个方法并不会对异常进行处理，而是选择throw出去给调用这个函数的地方。另外，如果你在调用后端接口之前还有一些特殊的业务逻辑需要处理，比如对日期进行格式化，对数据进行加工，那么你需要用`tryCatch`对你的业务逻辑代码进行异常处理，防止报错导致页面崩溃。
```typescript
tryCatch(() => {
  const result = await API.gazelle.companyFinancialIndicator.getById.fetch({
    yearType: year,
  });
  if (!result.success) throw new Error(result.message);
  setDetail(result.data);
})
```
3. 如果前端需要的数据格式和后端返回的格式有区别（最常见的就是日期和文件），那么你需要自己构造一个类型来对这些特殊属性进行处理。这个时候最好是使用typescript提供的`Utility Types(工具类型)`来尽可能复用已有的类型。例如：
```typescript
export type PolicyDetailDTO = Pick<
  defs.gazelle.PolicyDTO,
  | 'policyId'
  | 'policyType'
  | 'title'
  | 'indexCode'
  | 'issueNumber'
  | 'issueOrg'
  | 'subjectType'
  | 'subjectWord'
  | 'tenantCode'
> & {
  issueDate: moment.Moment;
  finalDate: moment.Moment;
  attachment?: UploadFile[];
};
```
