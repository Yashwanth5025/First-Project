import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Home = () => {
    const [ingredients, setIngredients] = useState([]);
    const [recipes, setRecipes] = useState([]);
    const [cuisine, setCuisine] = useState([]);
    const [showCuisineInput , setShowCuisineInput] = useState(false);

    // Function to add ingredients
    const handleAddIngredient = () => {
        const ingredient = document.getElementById('ingredient').value;
        if (ingredient) {
            setIngredients(prevIngredients => [...prevIngredients, ingredient]);
            document.getElementById('ingredient').value = '';
        }
    };
    const handleAddCuisine = () => {
        const cuisine = document.getElementById('cuisine').value;
        if (cuisine) {
            setCuisine(prevcuisine => [cuisine]);
            document.getElementById('cuisine').value = '';
        }
    };

    // Function to fetch high-protein Indian recipes
    const fetchHighProteinIndianRecipes = () => {
        const apiKey = '8eee3374681a4933bcc8a5d17ea48d37'; // Use your actual API key here
        const minProtein = 15;

        // Join the user ingredients into a comma-separated string
        const ingredientsStr = ingredients.join(',');
        const cuisineStr = cuisine

        axios.get(`https://api.spoonacular.com/recipes/complexSearch`, {
            params: {
                apiKey: apiKey,
                cuisine: cuisineStr,
                addRecipeInformation: true,
                addRecipeNutrition: true,
                number: 10,
                includeIngredients: ingredientsStr,  // Add user's ingredients to the search
                'minProtein': minProtein // Use correct filter for high-protein recipes
            }
        })
        .then((response) => {
            if (response.data.results.length > 0) {
                setRecipes(response.data.results);
            } else {
                alert('No recipes found');
            }
        })
        .catch(error => {
            console.error("Error fetching recipes: ", error);
            alert('Error fetching recipes, please try again later.');
        });
    }

    return (
        <div>
            <div className='flex items-center justify-center'>
                <h1 className='text-6xl font-bold mt-8'>Welcome To Instabite</h1>
            </div>

            <div className='flex items-center justify-center'>
                
                {!showCuisineInput ? (
                    <input
                    type="text"
                    id="ingredient"
                    className="border-2 border-gray-800 py-2 px-6 mt-40 ml-28 rounded-full w-3/12"
                    placeholder="Add ingredients (max 3)"
                />
                ) : (
                    <input
                        type="text"
                        id="cuisine"
                        className="border-2 border-gray-800 py-2 px-6 mt-40 ml-28 rounded-full w-3/12"
                        placeholder="Add cuisine"

                    />
                )}
                <button className="mt-40 ml-2 border bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-full"
                    onClick={() => setShowCuisineInput(true)}>
                    Add Cuisine
                </button>
                
            </div>
            <div className='flex items-center justify-center'>
                <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-full mt-8"
                    onClick={ !showCuisineInput ? handleAddIngredient : handleAddCuisine}
                >
                    Add
                </button>
                <button
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-full mt-8 ml-4"
                    onClick={() => {
                        setIngredients([]);
                        setRecipes([]);
                        setCuisine([]);
                        setShowCuisineInput(false);
                    }}
                >
                    Clear
                </button>
            </div>
            <div className='flex items-center justify-center'><h2 className="mt-3 font-bold">Ingredients:</h2></div>
            <div className='flex items-center justify-center'>               
                <ul className="list-disc mt-3 ml-8">
                    {ingredients.map((ingredient, index) => (
                        <li key={index}>{ingredient}</li>
                    ))}
                </ul>
            </div>

            <div className='flex items-center justify-center'><h2 className="mt-3 font-bold">Cuisine:</h2></div>
            <div className='flex items-center justify-center'>               
                <ul className="list-disc mt-3 ml-8">
                    {cuisine.map((cuisine, index) => (
                        <li key={index}>{cuisine}</li>
                    ))}
                </ul>
            </div>           

            {/* Button to create recipe */}
            <div className='flex items-center justify-center'>
                <button
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-full mt-8"
                    onClick={fetchHighProteinIndianRecipes}
                >
                    {fetchHighProteinIndianRecipes.length === 0 ? 'Create Recipe' : 'Loading...'}
                </button>
            </div>

            {/* Display recipes */}
            <div className='flex items-center justify-center'>
                <h2 className="mt-3 font-bold">Recipes:</h2>
            </div>
            <div className='flex items-center justify-center'>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 w-full max-w-7xl">
                    {recipes.map((recipe, index) => (
                        <div
                            key={index}
                            className="p-4 bg-gray-100 rounded-lg shadow-md flex flex-col justify-between hover:cursor-pointer hover:bg-gray-200"
                            style={{ width: "300px", height: "400px" }} // Set fixed card size
                        >
                            <div className="mb-4">
                                <h3 className='text-xl font-bold mb-2'>{recipe.title}</h3>
                                {recipe.nutrition && recipe.nutrition.nutrients && (
                                    <p className='font-semibold'>Protein: {recipe.nutrition.nutrients.find(nutrient => nutrient.name === "Protein")?.amount || 0}g/100g</p>
                                )}
                            </div>
                            <div className="flex-grow flex justify-center items-center">
                                <img
                                    src={recipe.image}
                                    alt={recipe.title}
                                    className='rounded border object-cover'
                                    style={{ width: "100%", height: "200px" }} // Ensure image fits the card
                                />
                            </div>
                            <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full mt-4' onClick={() => window.open(recipe.spoonacularSourceUrl, '_blank')}>
                                Get Recipe
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Home;
