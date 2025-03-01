document.addEventListener("DOMContentLoaded", () => {
    const apiUrlInput = document.getElementById("apiUrl");
    const getDataBtn = document.getElementById("fetchData");
    const addInput = document.getElementById("addInput");
    const addItemBtn = document.getElementById("addItem");
    const updateIdInput = document.getElementById("updateId");
    const updateTitleInput = document.getElementById("updateTitle");
    const updateItemBtn = document.getElementById("updateItem");
    const deleteIdInput = document.getElementById("deleteId");
    const deleteItemBtn = document.getElementById("deleteItem");
    const displayArea = document.getElementById("displaydata");

    const errorMessage = document.getElementById("errorMessage");
    const errorMessagepost = document.getElementById("errorMessagepost");
    const errorMessageupdate = document.getElementById("errorMessageupdate");
    const errorMessagedelete = document.getElementById("errorMessagedelete");

    let apiUrl = "";
    let localData = [];

    function showError(element, message) {
        element.textContent = message;
        element.style.display = "block";
    }

    function hideError(element) {
        element.style.display = "none";
    }
// get
    getDataBtn.addEventListener("click", () => {
        apiUrl = apiUrlInput.value.trim();
        if (!apiUrl) {
            showError(errorMessage, "Please enter a valid API URL");
            return;
        }
        hideError(errorMessage);

        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                localData = data;
                displayData(localData);
            })
            .catch(() => showError(errorMessage, "Error fetching data!"));
    });
//post
    addItemBtn.addEventListener("click", () => {
        const newItem = addInput.value.trim();
        if (!apiUrl || !newItem) {
            showError(errorMessagepost, "Enter a valid API URL and new item");
            return;
        }
        hideError(errorMessagepost);

        const newItemData = {
            id: localData.length + 1,
            title: newItem,
            price: 29.99,
            category: "electronics",
            description: "Test product"
        };

        fetch(apiUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newItemData)
        })
        .then(response => response.json())
        .then(() => {
            addInput.value = "";
            localData.push(newItemData);
            displayData(localData);
        })
        .catch(() => showError(errorMessagepost, "Error adding item!"));
    });
// update
    updateItemBtn.addEventListener("click", () => {
        const id = updateIdInput.value.trim();
        const newTitle = updateTitleInput.value.trim();
        if (!apiUrl || !id || !newTitle) {
            showError(errorMessageupdate, "Enter valid API URL, ID, and new title");
            return;
        }
        hideError(errorMessageupdate);

        fetch(`${apiUrl}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title: newTitle })
        })
        .then(response => response.json())
        .then(() => {
            localData = localData.map(item => item.id == id ? { ...item, title: newTitle } : item);
            displayData(localData);
        })
        .catch(() => showError(errorMessageupdate, "Error updating item!"));
    });
// delete
    deleteItemBtn.addEventListener("click", () => {
        const id = deleteIdInput.value.trim();
        if (!apiUrl || !id) {
            showError(errorMessagedelete, "Enter a valid API URL and ID");
            return;
        }
        hideError(errorMessagedelete);

        fetch(`${apiUrl}/${id}`, { method: "DELETE" })
        .then(response => {
            if (!response.ok) throw new Error("Failed to delete item");
            localData = localData.filter(item => item.id != id);
            displayData(localData);
        })
        .catch(() => showError(errorMessagedelete, "Error deleting item!"));
    });

    function displayData(data) {
        displayArea.innerHTML = "";
        if (!Array.isArray(data) || data.length === 0) {
            displayArea.innerHTML = "<p>No data available.</p>";
            return;
        }

        data.forEach(item => {
            const itemElement = document.createElement("div");
            itemElement.className = "data-item";
            itemElement.innerHTML = `
                <strong>ID:</strong> ${item.id} <br>
                <strong>Title:</strong> ${item.title} <br>
                <strong>Price:</strong> ${item.price || "N/A"} <br>
                <strong>Category:</strong> ${item.category || "N/A"} <br>
                <strong>Description:</strong> ${item.description || "N/A"}
                <hr>
            `;
            displayArea.appendChild(itemElement);
        });
    }
});

