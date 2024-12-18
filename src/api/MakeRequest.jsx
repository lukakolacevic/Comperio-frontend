export async function makeRequestWithRetry(url, options) {
    // Define a function to make the actual request
    const makeRequest = async () => {
      const response = await fetch(url, options);
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Unauthorized"); // Trigger token refresh attempt
        }
        else if(response.status === 400){
            throw new Error('Already enrolled');
        }
        console.log(response);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    };
  
    try {
      // Attempt to make the request initially
      return await makeRequest();
    } catch (error) {
      if (error.message === "Unauthorized") {
        console.log("Refreshing token...");
        const refreshResponse = await fetch(
          `${import.meta.env.VITE_REACT_BACKEND_URL}/refresh-token`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          }
        );
  
        if (!refreshResponse.ok) {
          throw new Error("Failed to refresh token");
        }
  
        // Retry the original request after refreshing the token
        return await makeRequest();
      } else {
        // Propagate other errors
        throw error;
      }
    }
}

