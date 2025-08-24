// This file contains all the JavaScript for our property management app

// Wait for the document to fully load before running our code
document.addEventListener('DOMContentLoaded', function() {
    // Get the form element
    const propertyForm = document.getElementById('property-form');
    
    // Get the container where properties will be displayed
    const propertiesContainer = document.getElementById('properties-container');
    
    // Array to store our properties
    let properties = [];
    
    // Add event listener for form submission
    propertyForm.addEventListener('submit', function(e) {
        e.preventDefault(); // Prevent page from refreshing
        
        // Get input values from the form
        const name = document.getElementById('property-name').value;
        const location = document.getElementById('property-location').value;
        const type = document.getElementById('property-type').value;
        const rent = document.getElementById('property-rent').value;
        const status = document.getElementById('property-status').value;
        const notes = document.getElementById('property-notes').value;
        
        // Create a property object
        const property = {
            id: Date.now(), // Unique ID using current timestamp
            name,
            location,
            type,
            rent,
            status,
            notes,
            dateAdded: new Date().toLocaleDateString('en-KE') // Kenyan date format
        };
        
        // Add the property to our array
        properties.push(property);
        
        // Save to localStorage (so data persists between page refreshes)
        savePropertiesToStorage();
        
        // Update the display
        renderProperties();
        
        // Reset the form
        propertyForm.reset();
        
        // Show a confirmation message
        alert('Property added successfully!');
    });
    
    // Function to save properties to localStorage
    function savePropertiesToStorage() {
        localStorage.setItem('properties', JSON.stringify(properties));
    }
    
    // Function to load properties from localStorage
    function loadPropertiesFromStorage() {
        const storedProperties = localStorage.getItem('properties');
        if (storedProperties) {
            properties = JSON.parse(storedProperties);
        }
    }
    
    // Function to display properties
    function renderProperties() {
        // Clear the container
        propertiesContainer.innerHTML = '';
        
        // Check if there are no properties
        if (properties.length === 0) {
            propertiesContainer.innerHTML = '<p id="no-properties">No properties added yet. Start by adding your first property above!</p>';
            return;
        }
        
        // Loop through each property and create HTML for it
        properties.forEach(property => {
            const propertyElement = document.createElement('div');
            propertyElement.classList.add('property-card');
            propertyElement.innerHTML = `
                <h3>${property.name}</h3>
                <p><strong>Location:</strong> ${property.location}</p>
                <div class="property-meta">
                    <span><strong>Type:</strong> ${property.type}</span>
                    <span><strong>Rent:</strong> KSh ${Number(property.rent).toLocaleString('en-KE')}</span>
                    <span><strong>Status:</strong> ${property.status}</span>
                </div>
                ${property.notes ? `<p><strong>Notes:</strong> ${property.notes}</p>` : ''}
                <p><strong>Date Added:</strong> ${property.dateAdded}</p>
                <div class="property-actions">
                    <button class="btn-edit" onclick="editProperty(${property.id})">Edit</button>
                    <button class="btn-delete" onclick="deleteProperty(${property.id})">Delete</button>
                </div>
            `;
            
            // Add to the container
            propertiesContainer.appendChild(propertyElement);
        });
    }
    
    // Function to delete a property
    window.deleteProperty = function(id) {
        if (confirm('Are you sure you want to delete this property?')) {
            // Filter out the property with the given ID
            properties = properties.filter(property => property.id !== id);
            
            // Save to storage
            savePropertiesToStorage();
            
            // Update the display
            renderProperties();
        }
    };
    
    // Function to edit a property (simplified version)
    window.editProperty = function(id) {
        // Find the property to edit
        const propertyToEdit = properties.find(property => property.id === id);
        
        if (propertyToEdit) {
            // Fill the form with the property data
            document.getElementById('property-name').value = propertyToEdit.name;
            document.getElementById('property-location').value = propertyToEdit.location;
            document.getElementById('property-type').value = propertyToEdit.type;
            document.getElementById('property-rent').value = propertyToEdit.rent;
            document.getElementById('property-status').value = propertyToEdit.status;
            document.getElementById('property-notes').value = propertyToEdit.notes;
            
            // Remove the property from the list (since we're editing it)
            properties = properties.filter(property => property.id !== id);
            
            // Save to storage
            savePropertiesToStorage();
            
            // Update the display
            renderProperties();
            
            // Scroll to the form
            document.querySelector('.form-container').scrollIntoView({
                behavior: 'smooth'
            });
        }
    };
    
    // Load properties from storage when the page loads
    loadPropertiesFromStorage();
    
    // Display the properties
    renderProperties();
});