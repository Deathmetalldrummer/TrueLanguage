export default {
    state: {
        globalLoading: true,
    },
    getters: {
        globalLoading: state=>state.globalLoading,
    },
    mutations: {
        globalLoading:(state,payload)=>{state.globalLoading = payload},
    },
    actions: {
        globalLoading:({commit},payload)=>{
            const loading = document.querySelector('#loading');
            if (loading && !payload) {
                loading.classList.add('hide')
            }
            if (loading && payload) {
                loading.classList.remove('hide')
            }
            commit('globalLoading', payload);
        },
    },
}
