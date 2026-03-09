const loadCard = () => {
    fetch("https://phi-lab-server.vercel.app/api/v1/lab/issues")
    .then((res) => res.json())
    .then((json) => console.log(json.data));
};

const displayCard = (lesson) => {
    console.log(lesson);
    
}

loadCard();