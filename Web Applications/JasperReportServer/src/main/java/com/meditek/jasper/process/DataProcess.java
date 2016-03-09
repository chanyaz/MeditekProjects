/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.meditek.jasper.process;

import com.meditek.jasper.model.FormDataModel;
import com.meditek.jasper.model.PatientKinModel;
import com.meditek.jasper.model.PatientModel;
import com.meditek.jasper.model.ReportDataWrapperModel;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;

import java.util.Dictionary;
import java.util.Enumeration;
import java.util.Hashtable;
import java.util.List;

/**
 *
 * @author rockmanexe1994
 */
public class DataProcess {
    
    public Hashtable iTextDataParse (List<FormDataModel> data){
        Hashtable parsedData = new Hashtable();
        for (FormDataModel d: data){
            if(d.getType().equals("clh")) parsedData.put(d.getName().toLowerCase(), d.getValue());
            else if(d.getType().equals("rlh")) {
                if(d.getChecked()==Boolean.TRUE){
                    System.out.println("run true");
                    parsedData.put(d.getName().toLowerCase(), d.getValue());
                }
                else{
                    System.out.println("run false");

                }
            }
            else if(d.getType().equals("table")){
                parsedData = iTextTableParse(d, parsedData, data);
            }
            else if(d.getType().equals("break")) continue;
            else parsedData.put(d.getName().toLowerCase(), d.getValue());
        }
        return parsedData;
    }
    
    private Hashtable iTextTableParse (FormDataModel tableTypeObj, Hashtable parsedData, List<FormDataModel> data){
        String name = tableTypeObj.getName();
        String parent = tableTypeObj.getRef();
        for(FormDataModel d : data){
            if(d.getRef().equals(parent)){
                if(d.getType().equals("rlh")) {
                    if(d.getChecked()==Boolean.TRUE){
                        parsedData.put(name+"_"+d.getRefChild().toLowerCase(), d.getValue());
                    }
                }
                else{
                    parsedData.put(name+"_"+d.getRefChild().toLowerCase(), d.getValue());
                }
            }
        }
        return parsedData;
    }
    
    public Hashtable jasperDataParse(List<FormDataModel> data){
        Hashtable parsedData = new Hashtable();
        //init params
        List<String> tableRefs = new ArrayList<String>();
        List<FormDataModel> tableIdentity = new ArrayList<FormDataModel>();
        // find all table in data and put all the ref into tableRefs list
        for(FormDataModel d : data){
            if (d.getType().equals("table")){
                tableRefs.add(d.getRef());
                tableIdentity.add(d);
            }
        }
        // populate all tables
        for(FormDataModel d : tableIdentity){
            List<Hashtable> tableHash = jasperTableDataParse(d, d.getColumns(), d.getRows(), data);
            parsedData.put(d.getName().toLowerCase(), tableHash);
        }
        //populate remaning data (non-table)
        for(FormDataModel d : data){
            //only if it's not table identity or not a cell in a table
            if(!(d.getType().equals("table") || tableRefs.contains(d.getRef()))){
                parsedData.put(d.getName().toLowerCase(), d.getValue());
            }
        }
        return parsedData;
    }
    
    private List<Hashtable> jasperTableDataParse(FormDataModel tableIdentity, int numOfCols, int numOfRows, List<FormDataModel> formData){
        List<Hashtable> parsedTable = new ArrayList<Hashtable>();
        // Illiterate over the data list to find the cell of the matching table (have matched tableRef)
        String tableRef = tableIdentity.getRef();
        Hashtable matchTableData = new Hashtable();
        for(FormDataModel d : formData){
            System.out.println(d.getRefChild()+" - "+d.getRef()+ " - "+d.getValue());
            if(d.getRef().equals(tableRef) && !d.getType().equals("table")) matchTableData.put(d.getRefChild(), d.getValue());
        }
        //Populate the table
        int tableFieldLimit = numOfRows*numOfCols;
//        int colIndex = 0;
//        int rowIndex = 0;
        for(int rowIndex=0; rowIndex<numOfRows; rowIndex++){
            Hashtable rowData = new Hashtable();
            for(int colIndex=0; colIndex<numOfCols; colIndex++){
                String cellData = (matchTableData.get("field_"+rowIndex+"_"+colIndex))==null?"":(matchTableData.get("field_"+rowIndex+"_"+colIndex)).toString();
                System.out.println("this is data of row "+rowIndex+" col "+colIndex+" : "+cellData);
                rowData.put("value"+String.valueOf(colIndex), cellData);
            }
            parsedTable.add(rowData);
        }
        System.out.println("Number of rows: "+parsedTable.size());
        for(Hashtable hash : parsedTable){
            System.out.println("Size of dictionary: "+hash.size());
        }
        return parsedTable;
    }
    
    
}