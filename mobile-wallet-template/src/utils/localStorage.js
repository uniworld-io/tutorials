import AsyncStorage from "@react-native-community/async-storage";

export const saveItemLocal = (key, value) => {
    AsyncStorage.setItem(key, JSON.stringify(value))
}


export const getLocalJson = async (key) => {
    try {
        const dataString = await AsyncStorage.getItem(key)
        return JSON.parse(dataString)
    } catch (err) {
        console.log('err load local storage', err);
        return {};
    }
}