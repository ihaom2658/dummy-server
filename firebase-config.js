import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc, query, orderBy, limit, getDocs, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyCWvmTD7ZqrM8QS2jAtIoxyYw9zDghyyZo",
    authDomain: "dummy-server-ff1b9.firebaseapp.com",
    projectId: "dummy-server-ff1b9",
    storageBucket: "dummy-server-ff1b9.firebasestorage.app",
    messagingSenderId: "275700573811",
    appId: "1:275700573811:web:bb1290a5e5ec97a73cac06"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 랭킹 저장 함수
export async function saveScore(gameName, difficulty, nickname, score) {
    try {
        await addDoc(collection(db, "rankings"), {
            game: gameName,
            diff: difficulty.toUpperCase(),
            name: nickname || "익명",
            score: Number(score),
            timestamp: serverTimestamp()
        });
        return true;
    } catch (e) {
        console.error("저장 실패:", e);
        return false;
    }
}

// 랭킹 불러오기 함수
export async function getRankings(gameName, difficulty) {
    try {
        const q = query(collection(db, "rankings"), orderBy("score", "desc"), limit(100));
        const snap = await getDocs(q);
        const results = [];
        snap.forEach(doc => {
            const data = doc.data();
            if ((!data.game || data.game === gameName) && data.diff === difficulty) {
                results.push(data);
            }
        });
        return results.slice(0, 5); // 상위 5개만 반환
    } catch (e) {
        console.error("로딩 실패:", e);
        return [];
    }
}