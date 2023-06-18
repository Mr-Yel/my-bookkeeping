import Taro from '@tarojs/taro'
import { View, Input } from '@tarojs/components'
import { FormLabel } from './index'

const FormInput = ({ required, label, type='text', disabled, onChange, value, className, maxLength }) => {
  return <View className={`FormContent ${className ? className : ''}`}>
    <FormLabel label={label} required={required}></FormLabel>
    <Input
      type={type}
      placeholder='请填写'
      disabled={disabled}
      className='FormValue'
      maxLength={maxLength || -1}
      value={value}
      onInput={(e) => typeof onChange === 'function' && onChange(e)}
    ></Input>
  </View>
}

export default FormInput