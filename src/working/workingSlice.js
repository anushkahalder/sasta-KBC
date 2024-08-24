import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'


export const fetchQues = createAsyncThunk('fetchQues', async () => {
    console.log(`${process.env.PUBLIC_URL}/data.json`);
    console.log(`./data.json`)
    const data = await fetch('./data.json');

    // const data = await fetch(`../src/data.json`);
    const res = await data.json()
    return res;
})

export const workingSlice = createSlice({
    name: 'quiz',
    initialState: {
        isLoading: false,
        data: null,
        isError: false,
        score: null,
        ansArray: []
    },

    extraReducers: (builder) => {
        builder.addCase(fetchQues.fulfilled, (state, action) => {
            state.isLoading = false;
            const allData = action.payload
            const quesSet = new Set();

            while (quesSet.size !== 10) {
                const num = Math.floor(Math.random() * 30) + 1
                quesSet.add(num)
            }
            console.log(quesSet)

            const filteredData = allData.filter((item) => quesSet.has(item.id));

            console.log(filteredData);
            state.data = filteredData;
            console.log(state.data);


        })
        builder.addCase(fetchQues.pending, (state, action) => {
            state.isLoading = true;
            state.data = action.payload
        })
        builder.addCase(fetchQues.rejected, (state, action) => {
            console.log("error", action.payload)
            state.isError = true;
        })

    },

    reducers: {

        updateAnsArray: (state, action) => {
            const [ans, quesId] = action.payload
            let newArr = [...state.ansArray];
            newArr[quesId] = ans
            state.ansArray = newArr;
            
            console.log(state.ansArray, "from updated")

        },

        mapAns: (state) => {

            const answer = [...state.ansArray]
            const dataSet = state.data;
            let score = 0

            dataSet.map((item) => {
                if (item.answerIndex === answer[item.id]) {
                    score++;
                }
            })
            state.score = score;
            console.log(score, "score")

        },
        resetGame: (state) => {
            state.isLoading = false;
            state.data = null;
            state.isError = false;
            state.score = null;
            state.ansArray = [];
        },



    }

})

export const {  mapAns, resetGame, updateAnsArray } = workingSlice.actions

export default workingSlice.reducer
