import welcome from "./templates/welcome/welcomeTemplate";

export const getEmailData = (to, name, token, template) => {
  let data = null;

  switch (template) {
    case "welcome":
      data = {
        from: '"Waves 👻" <waves.guitars.shop@gmail.com>', // sender address
        to,
        subject: `Welcome to waves ${name} ✔`, // Subject line

        html: welcome(),
      };
      break;
    default:
      return data;
  }

  return data;
};
