export default {
    state: {
        winSize: {
            width: null,
            height: null,
            mobile: false,
            desktop: true,
            tablet: false
        }
    },
    getters: {
        winSize: state => state.winSize
    },
    mutations: {
        winSize: (state, {width, height}) => {
            state.winSize.width = width;
            state.winSize.height = height;
            state.winSize.desktop = width > 1024;
            state.winSize.tablet = width > 768 && width <= 1024;
            state.winSize.mobile = width <= 768;
        }
    },
    actions: {
        winSize: (state, data) => state.commit('winSize', data)
    },
}
