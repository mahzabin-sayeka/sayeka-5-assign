// const loadCard = () => {
//     fetch("https://phi-lab-server.vercel.app/api/v1/lab/issues")
//     .then((res) => res.json())
//     .then((json) => console.log(json.data));
// };

// const displayCard = (lesson) => {
//     console.log(lesson);
    
// }

// loadCard();


let allIsuData = [];

// Data load logic 
const loadCard = () => {
    fetch("https://phi-lab-server.vercel.app/api/v1/lab/issues")
        .then((res) => res.json())
        .then((json) => {
            allIsuData = json.data;
            dispIsuCards(allIsuData); 
        })
        .catch(err => console.log("Fetch error:", err));
};

// Logic-Desn + Specific Clr
const dispIsuCards = (dataArr) => {
    const grdBox = document.getElementById('isue-grid-box');
    const totNumTxt = document.getElementById('total-issu-count');
    
    if(!grdBox || !totNumTxt) return;

    totNumTxt.innerText = `${dataArr.length} Issues`;
    grdBox.innerHTML = "";

    dataArr.forEach((item) => {
        // Color Logic: High/Medium = Green, Low = Purple
        let topBarClr = 'border-t-purple-500'; 
        const pLvl = item.priority ? item.priority.toLowerCase() : 'low';
        
        if (pLvl === 'high' || pLvl === 'medium') {
            topBarClr = 'border-t-emerald-500'; 
        }

        const cardDiv = document.createElement("div");
        cardDiv.className = `bg-white p-6 rounded-lg border border-gray-200 border-t-4 ${topBarClr} shadow-sm hover:shadow-md cursor-pointer transition-all`;
        
        const shortId = item._id ? item._id.slice(-1) : '1';

        cardDiv.innerHTML = `
            <div class="flex justify-between items-start mb-4">
                <div class="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-500">
                    <i class="fa-solid fa-circle-notch"></i>
                </div>
                <span class="text-[11px] font-bold uppercase px-3 py-1 rounded-full bg-red-50 text-red-500 tracking-wider">
                    ${item.priority}
                </span>
            </div>

            <h4 class="font-bold text-slate-800 text-lg mb-2 leading-snug">${item.title}</h4>
            <p class="text-slate-500 text-sm mb-6 line-cut">${item.description}</p>
            
            <div class="flex gap-2 mb-6">
                <span class="bg-red-50 text-red-500 border border-red-100 text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1">
                    <i class="fa-solid fa-bug"></i> BUG
                </span>
                <span class="bg-amber-50 text-amber-600 border border-amber-100 text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1">
                    <i class="fa-solid fa-life-ring"></i> HELP WANTED
                </span>
            </div>

            <div class="pt-4 border-t border-gray-100 text-slate-500 text-sm space-y-1">
                <p>#${shortId} by ${item.author}</p>
                <p>${new Date(item.createdAt).toLocaleDateString()}</p>
            </div>
        `;
        
        cardDiv.onclick = () => showPopData(item._id);
        grdBox.appendChild(cardDiv);
    });
};

// modal-work
const showPopData = (isuId) => {
    const popContainer = document.getElementById('pop-up-main');
    const dtaBox = document.getElementById('open-modal-dat');
    
    popContainer.classList.remove('hidden');
    dtaBox.innerHTML = `<p class="text-center py-10 animate-pulse text-indigo-500">Wait, loading info...</p>`;

    fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issue/${isuId}`)
        .then(res => res.json())
        .then(json => {
            const info = json.data;
            dtaBox.innerHTML = `
                <div class="flex items-center gap-3 mb-2">
                    <span class="bg-emerald-500 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase">${info.status}</span>
                    <span class="text-gray-400 text-xs">Reporter: ${info.author}</span>
                </div>
                <h2 class="text-2xl font-bold text-gray-900">${info.title}</h2>
                <p class="text-gray-500 text-sm leading-relaxed border-y py-4 my-4">${info.description}</p>
                <div class="bg-gray-50 p-4 rounded-xl grid grid-cols-2 gap-4">
                    <div>
                        <p class="text-gray-400 text-[10px] font-bold uppercase tracking-widest">Assignee</p>
                        <p class="font-bold text-gray-800">${info.author}</p>
                    </div>
                    <div>
                        <p class="text-gray-400 text-[10px] font-bold uppercase tracking-widest">Priority</p>
                        <span class="text-red-500 font-bold uppercase">${info.priority}</span>
                    </div>
                </div>
            `;
        });
};

// TabToggle
document.querySelectorAll('.tab-btun').forEach(btn => {
    btn.onclick = (e) => {
        
        document.querySelectorAll('.tab-btun').forEach(b => {
            b.classList.remove('bg-[#4F16F0]', 'text-white');
            b.classList.add('bg-white', 'text-gray-800');
        });

        
        e.target.classList.remove('bg-white', 'text-gray-800');
        e.target.classList.add('bg-[#4F16F0]', 'text-white');

        const filterVal = e.target.dataset.filter;
        const filteredData = filterVal === 'all' ? allIsuData : allIsuData.filter(i => i.status === filterVal);
        dispIsuCards(filteredData);
    };
});

// Search Logic
const srchBox = document.getElementById('serach-box-input');
if(srchBox) {
    srchBox.oninput = (ev) => {
        const val = ev.target.value.toLowerCase();
        fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q=${val}`)
            .then(res => res.json())
            .then(json => dispIsuCards(json.data));
    };
}

// Modal Close
const offBtn = document.getElementById('off-buton');
if(offBtn) {
    offBtn.onclick = () => {
        document.getElementById('pop-up-main').classList.add('hidden');
    };
}

// Start Execution
loadCard();