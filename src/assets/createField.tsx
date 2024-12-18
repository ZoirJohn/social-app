import { Field } from 'redux-form'
import { Input, InputCheckbox } from './Input'
import { Validator, ValidatorOfLength } from './Validators'

function createField<FormKeysValues extends string>(name: FormKeysValues, placeholder: string, validators: Array<Validator | ValidatorOfLength>, type: any) {
      return <Field name={name} component={type ? InputCheckbox : Input} placeholder={placeholder} validate={type ? [] : validators} />
}

export default createField
