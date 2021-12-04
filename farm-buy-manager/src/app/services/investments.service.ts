import { Injectable } from '@angular/core';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { addDoc, collection, getDocs, getFirestore, onSnapshot, orderBy, updateDoc, query, getDoc, doc, setDoc, increment, where, deleteDoc } from "firebase/firestore";
import { BehaviorSubject, Subscription } from 'rxjs';
import { Investment, Ranking } from '../models/investment.model';

@Injectable({
  providedIn: 'root'
})
export class InvestmentsService {

  unsubscribe: any;

  investments: BehaviorSubject<Investment[]> = new BehaviorSubject<Investment[]>(null as any)
  investmentStatus = this.investments.asObservable();

  constructor() {
    this.authStautsListener();
   }

  authStautsListener() {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.getInvestmentObservable();
      } else {
        this.unsubscribe();
      }
    });
  }

  async getInvestmentObservable() {
    const firestore = getFirestore()

    const q = query(collection(firestore, "investments"), orderBy("points", "desc"));

    this.unsubscribe = onSnapshot(q, (querySnapshot) => {
      const investments: Investment[] = [];
      querySnapshot.forEach((doc) => {
        investments.push(doc.data({serverTimestamps: "estimate"}) as Investment)
      });
      this.investments.next(investments);
    });
  }

  async addInvestment(investment: Investment) {
    const firestore = getFirestore();

    const colRef = collection(firestore, "investments");

    let ref = await addDoc(colRef, {...investment});

    await updateDoc(ref, {
      uid: ref.id,
    });
  }

  async updateInvestment(investment: Investment) {
    const firestore = getFirestore();

    const docRef = doc(firestore, "investments/"+investment.uid);

    return updateDoc(docRef, {...investment});
  }

  async saveRanking(arr: Ranking[]) {
    const auth = getAuth();
    const firestore = getFirestore()
    for (let i = 0; i<arr.length; i++) {
      const q = query(collection(firestore, "rankings"), where("item", "==", arr[i].item), where("user", "==", auth.currentUser?.uid))
      const querySnapshot = await getDocs(q)
      let incrementvalue = 0;
      let ranking;
      if (!querySnapshot.empty) {
        let docsnap = querySnapshot.docs[0]
        ranking = docsnap.data() as Ranking;
        incrementvalue = (100-10*i) - ranking.points
        ranking.points = (100-10*i);
        if (ranking.points < 0) ranking.points = 0;
        let docRef = docsnap.ref;
        await setDoc(docRef, {...ranking})
      } else {
        incrementvalue = (100-10*i);
        if (incrementvalue < 0 ) incrementvalue = 0;
        ranking = <Ranking> {
          points: incrementvalue,
          item: arr[i].item,
          itemname: arr[i].itemname,
          user: auth.currentUser?.uid,
        }
        addDoc(collection(firestore, "rankings"), {...ranking})
      }
      await updateDoc(doc(firestore, "investments/"+arr[i].item), {
        points: increment(incrementvalue)
      });
    }
  }

  async getLastRankingPromise(): Promise<Ranking[]> {
    const firestore = getFirestore();
    const auth = getAuth();

    const q = query(collection(firestore, "rankings"), where("user", "==", auth.currentUser?.uid), orderBy("points", "desc"));

    const querySnapshot = await getDocs(q);
    let array: Ranking[] = [];
    querySnapshot.forEach((doc) => {
      array.push(doc.data() as Ranking)
    });
    return array;
  }

  async setToBought(uid: string) {
     const firestore = getFirestore();

     const docRef = doc(firestore, "investments/"+uid);
      return updateDoc(docRef, {
       points: 0,
       bought: true,
     }).then(() => {this.deleteRankings(uid)});
  }

  async delete(uid: string) {
    const firestore = getFirestore();
    const docRef = doc(firestore, "investments/"+uid);

    return deleteDoc(docRef).then(() => {this.deleteRankings(uid);});
  }


  async deleteRankings(uid: string) {
    const firestore = getFirestore();
    const q = query(collection(firestore, "rankings"), where("item", "==", uid));
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach(async (doc) => {
      let ref = doc.ref;
      await deleteDoc(ref);
    });
  }
}
