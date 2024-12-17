"use client"
import { createContext, useState, useEffect, useContext} from "react"
// Firebase
import {db} from '@/lib/firebase'
import {collection, addDoc, getDocs, doc, deleteDoc, updateDoc, query, where} from 'firebase/firestore'

import { authContext } from "@/lib/store/auth-context"; 

export const financeContext = createContext({
    income: [], 
    expenses: [], 
    addIncomeItem: async () => {}, 
    removeIncomeItem: async () => {}, 
    addExpenseItem: async () => {},
    addCategory: async () => {}, 
    deleteExpenseItem: async () => {}
}); 

export default function FinanceContextProvider({children}){ 
    const [income, setIncome] = useState([]);
    const [expenses, setExpenses] = useState([])
    
    const { user } = useContext(authContext); 
    const addCategory = async (category) => { 
        try{ 
            const collectionRef = collection(db, "expenses")
            const docSnap = await addDoc(collectionRef, {
                
                uid: user.uid, 
                ...category,
                items: [],      
            });
            setExpenses(prevExpenses => {
                return [
                    ...prevExpenses,
                    {
                        id: docSnap.id, 
                        uid: user.uid, 
                        items: [], 
                        ...category, 
                    }
                ]
            })
        } catch (error){ 
            throw error
        }
    }
    const addExpenseItem = async (expenseCategryId, newExpense) => { 
        const docRef = doc(db, "expenses", expenseCategryId);
        
        try{
            await updateDoc(docRef, {...newExpense});
            //Update State
            setExpenses(prevState =>{ 
                const updatedExpenses = [...prevState]

                const foundIndex = updatedExpenses.findIndex(expense => {
                    return expense.id === expenseCategryId
                })
                updatedExpenses[foundIndex] = {id: expenseCategryId, ...newExpense}
                
                return updatedExpenses;
            })
        } catch (error){ 
            throw error
        }
    };
    
    const deleteExpenseItem = async (updatedExpense, expenseCategoryId) => { 
        try{
            const docRef = doc(db, "expenses", expenseCategoryId);   
            await updateDoc(docRef, {
                ...updatedExpense


            });
            setExpenses((prevExpenses) =>{ 
                const updatedExpenses = [...prevExpenses]; 
                const pos = updatedExpenses.findIndex((ex) => ex.id === expenseCategoryId); 
                updatedExpenses[pos].items = [...updatedExpense.items]; 
                updatedExpenses[pos].total = updatedExpense.total; 
            
                return updatedExpenses; 
            })
        }catch(error){ 
            throw error;
        }
    };
     
    const deleteExpenseCategory = async (expenseCategoryId) =>{ 
        try{ 
            const docRef = doc(db, "expenses", expenseCategoryId); 
            await deleteDoc(docRef); 
            
            setExpenses((prevExpenses) => { 
                const updatedExpenses = prevExpenses.filter(
                    (expense) => expense.id !== expenseCategoryId
                ); 
                return [...updatedExpenses]; 
            })
        } catch (error){ 
            throw error; 
        }
    }

    const addIncomeItem = async (newIncome) => { 
        const collectionRef = collection(db, "income");
        try{
            const docSnap = await addDoc(collectionRef, newIncome);
            

            //update state live:
            setIncome((prevState) => {
                return[
                    ...prevState, 
                    { 
                    id: docSnap.id,
                    ...newIncome,
                    },  
                ];
            });
        } catch (error){ 
            console.log(error.message); 
            throw error;
        }

    }
    const removeIncomeItem = async (incomeId) => { 
        const docRef = doc(db, 'income', incomeId);
        try{
          await deleteDoc(docRef);
          setIncome((prevState) => { 
            return prevState.filter((i) => i.id !== incomeId);        
          }); 
    
        } catch (error){ 
          console.log(error.message); 
          throw error;
        }
    }
    const values = {income, expenses, addIncomeItem, removeIncomeItem, addExpenseItem, addCategory, deleteExpenseItem, deleteExpenseCategory, query, where};
    
    useEffect(() => {
        if(!user) return; 
        
        const getIncomeData = async () => {
            const collectionRef = collection(db, 'income');
            
            const q = query(collectionRef, where("uid", "==", user.uid)); 
            
            const docsSnap = await getDocs(q); 

            console.log(docsSnap.docs);
            const data = docsSnap.docs.map((doc) => { 
                return{
                id:doc.id, 
                ...doc.data(), 
                createdAt: new Date(doc.data().createdAt.toMillis()),
                };

        }); 
        
        setIncome(data); 
        };
        const getExpensesData = async () => { 
            const collectionRef = collection (db, 'expenses'); 
            const q = query(collectionRef, where("uid", "==", user.uid)); 
            const docsSnap = await getDocs(q); 
            
            const data = docsSnap.docs.map((doc) =>{ 
                return { 
                    id: doc.id, 
                    ...doc.data(), 
                };  
            });
            setExpenses(data)
        };
        getIncomeData(); 
        getExpensesData(); 
    }, [user])

    return( <financeContext.Provider value={values}>
        {children}
    </financeContext.Provider>
    );
}