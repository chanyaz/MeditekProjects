//
//  ConfigurationSystem.swift
//  Telehealth
//
//  Created by Giap Vo Duc on 9/24/15.
//  Copyright © 2015 Giap Vo Duc. All rights reserved.
//

import UIKit
import SwiftyJSON

let config = ConfigurationSystem()
var savedData  = saveData()
let defaults = NSUserDefaults.standardUserDefaults()
var tokens = String()


struct ConfigurationSystem {
    static let Http = "http://testapp.redimed.com.au:3009"
    let deviceID = UIDevice.currentDevice().identifierForVendor?.UUIDString
    
    let headers = [
        "Authorization": "Bearer \(tokens)",
        "Content-Type": "application/x-www-form-urlencoded",
        "Version" : "1.0"
    ]
    //change border color textfield
    func borderTextFieldValid(textField:DesignableTextField,color:UIColor){
        textField.layer.borderColor = color.CGColor
        textField.layer.borderWidth = 1
        textField.cornerRadius = 4
    }
    //Giap: Check input only number
    func validateInputOnlyNumber(value: Int) -> Bool {
        switch value {
        case numberHashValue.number0 :
            return true
        case numberHashValue.number1 :
            return true
        case numberHashValue.number2 :
            return true
        case numberHashValue.number3 :
            return true
        case numberHashValue.number4 :
            return true
        case numberHashValue.number5 :
            return true
        case numberHashValue.number6 :
            return true
        case numberHashValue.number7 :
            return true
        case numberHashValue.number8 :
            return true
        case numberHashValue.number9 :
            return true
        case numberHashValue.delete :
            return true
        default:
            return false
        }
    }
}
//class handle get and set data calling
class saveData {
    var data: JSON = ""
    init(){}
    init(data:JSON){
        self.data = data
    }
}

class AppointmentList {
     var UIDApointment,ToTime,Status,FromTime,NameDoctor: String!
    init(UIDApointment:String,ToTime:String,Status:String,FromTime:String,NameDoctor:String){
        self.UIDApointment = UIDApointment
        self.ToTime = ToTime
        self.Status = Status
        self.FromTime = FromTime
        self.NameDoctor = NameDoctor
    }
}




