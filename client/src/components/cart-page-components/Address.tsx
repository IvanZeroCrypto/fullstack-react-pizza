import WhiteBlock from "../shared/white-block/WhiteBlock";
import FormInput from "../shared/FormInput/FormInput";
import FormTextArea from "../shared/form-textarea/FormTextArea";

const Address = () => {
  return (
    <WhiteBlock title="3.Адрес доставки">
      <FormInput name="address" title="Введите адрес" type="text" />
      <FormTextArea name="comment" title="Коментарий к заказу" />
    </WhiteBlock>
  );
};

export default Address;
