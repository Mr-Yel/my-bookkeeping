### 账户表 account
```js
{
  _id (主键) String 唯一key,
  img 非必填 String 账户图片,
  name 必填 String 账户名称,
}
```
### 用户表 users
```js
{
  _id (主键) String 唯一key,
  name 必填 String 用户名称,
  openid 必填 String 用户微信唯一key,
  picture 非必填 String 用户头像,
}
```
### 账本表 account_book
```js
{
  _id (主键) String 唯一key,
  account_id 必填 String 关联账户id,
  name 必填 String 账本名称,
  account_book_img 非必填 String 账本图片,
  property 必填 Number 账本余额，
  bill_types_use_by 必填 默认值 1, 1 使用个人关联的类型 2 使用账本关联的类型
}
```
### 账单表 bills
```js
{
  _id (主键) String 唯一key,
  account_id 必填 String 关联账户id,
  account_book_id 非必填 String 关联账本id,
  bill_type_id 必填 String 关联类型id，
  amount 必填 Number 账单金额,
  date_time 必填 Date 账单记录时间,
  notes 非必填 String 账单说明,
}
```
### 账单类型表 bill_types
```js
{
  _id (主键) String 唯一key,
  bill_type String 账单类型,
  bill_type_color String 类型颜色,
  bill_type_icon String 类型icon,
  bill_type_name String 类型名称，
  is_base_bill_type 非必填 Boolean 是否为基础类型，基础类型不会被删除，会再初始化的时候默认填入，
}
```
### 预算表 budget
```js
{
  _id (主键) String 唯一key,
  account_book_id 必填 String 关联账本,
  openid 必填 String 关联用户,
  bill_type_id 非必填 String 关联账单类型 预留字段，用于之后方便新增分类预算功能,
  property 必填 String 每月预算，
  start_date 必填 Date
  end_date 必填 Date
}
```
### 账单类型中间表 users_or_account_book_bill_types
```js
{
  _id (主键) String 唯一key,
  bill_type 必填 String 账单类型,
  account_book_id 非必填 String 关联账本,
  openid 非必填 String 关联用户,
  bill_type_id 必填 String 关联账单类型 ,
  sort 必填 Number 排序
}
```















