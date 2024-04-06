const initialState = {
    token: {
        userName : '',
        realToken  :'',
        user:''
    },
  };
  
  const tokenReducer = (state = initialState, action) => {
    switch (action.type) {
      case "ADDTOKEN":
        return { ...state, token: {userName : action.payload.userName, realToken : action.payload.realToken,user:action.payload.user} };
      default:
        return state;
    }
  };
  
  export default tokenReducer;


//   const initialState = {
//     totalPrice: null
//   };
  
//   export default function totalPriceReducer(state = initialState, action) {
//     switch (action.type) {
//       case 'ADD-TOTALPRICE':
//         return { ...state, totalPrice: action.payload };
//       default:
//         return state;
//     }
//   }