type Props = {
  length: number;
};

function generatePassword({ length }: Props = { length: 8 }) {
  let pass = '';
  
  let str = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 1; i <= length; i++) {
    let char = Math.floor(Math.random() * str.length + 1);

    pass += str.charAt(char);
  }

  return pass;
}

export default generatePassword;