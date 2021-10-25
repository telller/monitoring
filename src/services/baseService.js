import axios from 'axios'

const api = axios.create({
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})

api.interceptors.response.use(
  response => response.data,
  error => {
    // if (!isUndefined(error.response.data.issue)) {
    //   error.response.data.issue.forEach(elem => {
    //     toast.error(elem?.details?.text);
    //     if (JSON.stringify(error).includes('401')) {
    //       Router.push('/login');
    //     }
    //   });
    // } else {
    //   toast.error(error.response.data?.issue?.details?.text);
    // }
    console.log(error)
    return Promise.reject(error)
  }
)

export default api
