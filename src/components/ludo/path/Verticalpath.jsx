import { StyleSheet, Text, View } from 'react-native'
import React, {memo, useMemo} from 'react'
import Cell from './Cell'

const Verticalpath = ({cells, color}) => {
    const groupedCells = useMemo(()=>{
        if(!cells || cells.length === 0) return [];
        const groups = [];
        for(let i=0; i<cells.length; i+=3){
            groups.push(cells.slice(i, i+3));
        }
        return groups;
    }, [cells]);
    // Add debug logging
    console.log('Verticalpath cells:', cells);
    console.log('Verticalpath groupedCells:', groupedCells);

  return (
    <View 
    style={{flexDirection:'row', justifyContent:'center', alignItems:'center',width: '20%', height: '100%'}}
    >
        <View
        style={{flexDirection:'column', height: '100%', width: '100%'}}
        >
            {groupedCells.map((group, groupIndex)=>(
                <View
                key={`group-${groupIndex}`}
                style={{flexDirection:'row', width:'33.33%', height:'16.67%'}}
                >
                    {group.map((id, index) => (
                        <Cell key={`cell-${id}`} cell={true} id={id} color={color} index={`${groupIndex},${index}`} />
                    ))}
                </View>
            ))}
        </View>
        
      
    </View>
  )
}

export default memo(Verticalpath)

const styles = StyleSheet.create({})