/* eslint no-restricted-globals: 0 */
import { kruskalMST } from 'visual-insights';

function sum (arr) {
  let ans = 0;
  let len = arr.length;
  for (let i = 0; i < len; i++) {
    ans += arr[i];
  }
  return ans;
}
const cluster = (e) => {
  console.log('[cluster measures]')
  try {
    const { spaces, maxGroupNumber } = e.data;
    let result = [];
    for (let space of spaces) {
      const { edgesInMST, groups } = kruskalMST(space.matrix, maxGroupNumber);
      let measureGroups = new Map();
      for (let i = 0; i < groups.length; i++) {
        if (!measureGroups.has(groups[i])) {
          measureGroups.set(groups[i], [])
        }
        measureGroups.get(groups[i]).push(space.measures[i])
      }
      for (let group of measureGroups.values()) {
        result.push({
          dimensions: space.dimensions,
          measures: group.map(mea => mea.name),
          score: sum(group.map(mea => mea.value))
        })
      }
    }
    result.sort((a, b) => a.score - b.score)
    self.postMessage({
      success: true,
      data: result
    })
  } catch (error) {
    self.postMessage({
      success: false,
      message: error.toString()
    }) 
  }
}

self.addEventListener('message', cluster, false);
