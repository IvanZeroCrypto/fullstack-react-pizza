import FormInput from "../shared/FormInput/FormInput";
import WhiteBlock from "../shared/white-block/WhiteBlock";

const PersonalInfo = () => {
  return (
    <WhiteBlock title="2.Персональная информация">
      <form className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-11">
        <FormInput name="firstname" title="Имя" type="text" />
        <FormInput name="lastname" title="Фамилия" type="text" />
        <FormInput name="email" title="Email" type="email" />
        <FormInput name="phone" title="Телефон" type="tel" />
      </form>
    </WhiteBlock>
  );
};

export default PersonalInfo;
