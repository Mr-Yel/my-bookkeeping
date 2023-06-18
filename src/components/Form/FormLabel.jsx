import Taro from '@tarojs/taro'
import { Text } from '@tarojs/components'

const FormLabel = ({ label, required, bold }) => <Text className={`FormLabel ${bold ? 'bold' : ''}`}>
  {!!required && <Text className='required'>*</Text>}
  {label}
</Text>

export default FormLabel