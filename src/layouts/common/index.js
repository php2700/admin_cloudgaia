
export const logout = (navigate) => {
console.log("ggggg+++++++")
    navigate('/');
    setTimeout(() => {
        localStorage.removeItem("authToken");
    }, 100);

};