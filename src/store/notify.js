export default {
    state: {
        notify: []
    },
    getters: {
        notify: state => state.notify
    },
    mutations: {
        notifyAdd: (state, payload) => state.notify.push(payload),
        notifyDel: (state, payload) => { state.notify = state.notify.filter(item => item.id !== payload) }
    },
    actions: {
        notifyAdd: (state, payload) => {
            const notify = state.getters.notify;
            const id = notify.length > 0 ? notify[notify.length - 1].id + 1 : notify.length;
            const _payload = {
                id: id,
                ...payload
            };
            state.commit('notifyAdd', _payload);
            setTimeout(() => {
                state.dispatch('notifyDel', _payload.id)
            }, 10000)
        },
        notifyDel: (state, payload) => {
            state.commit('notifyDel', payload)
        }
    }
}


