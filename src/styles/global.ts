import { createGlobalStyle } from 'styled-components';
// verificar o que a de padrao na aplicacao e colocar nos estilos globais
export default createGlobalStyle`

*{
  margin:0;
  padding:0;
  box-sizing:border-box;
  outline:0;
}

body{
  background-color:#312e38;
  color:white;
}

body,input,button{
  font-family: 'Roboto Slab', serif;
  font-size:16px;
}

h1,h2,h3,h4,h5,h6,strong {
  font-weight:medium;
}
button {
  cursor: pointer;
}

`;
