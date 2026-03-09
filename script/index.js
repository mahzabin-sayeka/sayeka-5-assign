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


// Login 
const loginForm = document.getElementById('login-form');
const loginSection = document.getElementById('login-section');
const mainDashboard = document.getElementById('main-dashboard'); // Ensure dashboard container has this ID

if (loginForm) {
    loginForm.onsubmit = (e) => {
        e.preventDefault();
        
        const user = document.getElementById('username').value;
        const pass = document.getElementById('password').value;

        
        if (user === 'admin' && pass === 'admin123') {
            
            loginSection.classList.add('hidden');
            mainDashboard.classList.remove('hidden');
            
            
            if (typeof loadCard === "function") {
                loadCard(); 
            }
        } else {
            alert('Access Denied: Invalid Username or Password.');
        }
    };
}


const loadCard = () => {
    fetch("https://phi-lab-server.vercel.app/api/v1/lab/issues")
        .then((res) => res.json())
        .then((json) => {
            if (json.data) {
                allIsuData = json.data;
                dispIsuCards(allIsuData);
            }
        })
        .catch(err => console.error("Data fetch error:", err));
};

// Card Rendring
const dispIsuCards = (dataArr) => {
    const grdBox = document.getElementById('isue-grid-box');
    const totNumTxt = document.getElementById('total-issu-count');
    
    if(!grdBox || !totNumTxt) return;

    totNumTxt.innerText = `${dataArr.length} Issues`;
    grdBox.innerHTML = "";

    dataArr.forEach((item) => {
        let topBarClr = 'border-t-purple-500'; 
        const pLvl = item.priority ? item.priority.toLowerCase() : 'low';
        if (pLvl === 'high' || pLvl === 'medium') topBarClr = 'border-t-emerald-500';

        const cardDiv = document.createElement("div");
        cardDiv.className = `bg-white p-6 rounded-lg border border-gray-200 border-t-4 ${topBarClr} shadow-sm hover:shadow-md cursor-pointer transition-all`;
        
        const shortId = item._id ? item._id.slice(-4) : '0000';

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
                <span class="bg-red-50 text-red-500 border border-red-100 text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-1">
                    <i class="fa-solid fa-bug"></i> BUG
                </span>
                <span class="bg-amber-50 text-amber-600 border border-amber-100 text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-1">
                    <i class="fa-solid fa-circle-info"></i> HELP WANTED
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

// Modal Logic er kaj
const showPopData = (isuId) => {
    const popContainer = document.getElementById('pop-up-main');
    const dtaBox = document.getElementById('open-modal-dat');
    
    if(!popContainer || !dtaBox) return;

    popContainer.classList.remove('hidden');
    
    dtaBox.innerHTML = `
        <div class="flex items-center justify-center py-20">
            <p class="text-indigo-600 font-medium text-lg animate-pulse">Loading...</p>
        </div>
    `;

    fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issue/${isuId}`)
        .then(res => res.json())
        .then(json => {
            const item = json.data;
            if(!item) throw new Error("No data");

            dtaBox.innerHTML = `
                <div class="modal-content animate-in fade-in duration-300">
                    <h2 class="text-2xl font-bold text-slate-800 mb-2">${item.title}</h2>
                    
                    <div class="flex items-center gap-2 mb-4 text-sm">
                        <span class="bg-emerald-500 text-white px-3 py-0.5 rounded-full font-medium text-xs">Opened</span>
                        <span class="text-slate-400">• Opened by ${item.author} • ${new Date(item.createdAt).toLocaleDateString()}</span>
                    </div>

                    <div class="flex gap-2 mb-6">
                        <span class="bg-red-50 text-red-500 border border-red-100 text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-1">
                           <i class="fa-solid fa-bug"></i> BUG
                        </span>
                        <span class="bg-amber-50 text-amber-600 border border-amber-100 text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-1">
                           <i class="fa-solid fa-circle-info"></i> HELP WANTED
                        </span>
                    </div>

                    <p class="text-slate-500 text-sm leading-relaxed mb-8">
                        ${item.description}
                    </p>

                    <div class="bg-slate-50 rounded-xl p-6 grid grid-cols-2 gap-4 mb-2">
                        <div>
                            <p class="text-slate-400 text-xs mb-1 uppercase font-bold tracking-tighter">Assignee</p>
                            <p class="font-bold text-slate-800">${item.author}</p>
                        </div>
                        <div>
                            <p class="text-slate-400 text-xs mb-1 uppercase font-bold tracking-tighter">Priority</p>
                            <span class="bg-red-500 text-white px-4 py-1 rounded-full text-[10px] font-bold uppercase inline-block">
                                ${item.priority}
                            </span>
                        </div>
                    </div>
                </div>
            `;
        })
        .catch(err => {
            console.error("Fetch error:", err);
            dtaBox.innerHTML = `
                <div class="text-center py-10">
                    <p class="text-slate-400">Unable to load details. Please check connection.</p>
                </div>
            `;
        });
};

// Tab Filter r Search kora
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

const srchBox = document.getElementById('serach-box-input');
if(srchBox) {
    srchBox.oninput = (ev) => {
        const val = ev.target.value.toLowerCase();
        fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q=${val}`)
            .then(res => res.json())
            .then(json => dispIsuCards(json.data));
    };
}

const offBtn = document.getElementById('off-buton');
if(offBtn) {
    offBtn.onclick = () => {
        document.getElementById('pop-up-main').classList.add('hidden');
    };
}

loadCard();