const initialState = {
    token: {
        userName : '',
        realToken  :''
    },
  };
  
  const tokenReducer = (state = initialState, action) => {
    switch (action.type) {
      case "ADDTOKEN":
        return { ...state, token: {userName : action.payload.userName, realToken : action.payload.realToken} };
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