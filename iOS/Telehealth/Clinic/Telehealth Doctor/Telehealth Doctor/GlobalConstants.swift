//
//  GlobalConstants.swift
//  Telehealth Doctor
//
//  Created by Huy Nguyễn on 9/25/15.
//  Copyright © 2015 Giap Vo Duc. All rights reserved.
//

import Foundation
import Alamofire
import UIKit
import SwiftyJSON

/// ***declare server for all application***

/// Server Australia
let URL_SERVER_3009 = "http://testapp.redimed.com.au:3009"
let URL_SERVER_3005 = "http://testapp.redimed.com.au:3005"
let URL_SERVER_3006 = "http://testapp.redimed.com.au:3006"

/// Server Luân
//let URL_SERVER_3009 = "http://192.168.1.130:3009"
//let URL_SERVER_3005 = "http://192.168.1.130:3005"
//let URL_SERVER_3006 = "http://192.168.1.130:3006"

/// Server Việt Nam
//let URL_SERVER_3009 = "http://telehealthvietnam.com.vn:3009"
//let URL_SERVER_3005 = "http://telehealthvietnam.com.vn:3005"
//let URL_SERVER_3006 = "http://telehealthvietnam.com.vn:3006"

/// request url
let AUTHORIZATION = URL_SERVER_3006 + "/api/login"

let GET_INFO = URL_SERVER_3005 + "/api/doctor/get-doctor"

let GET_TELEUSER = URL_SERVER_3009 + "/api/telehealth/user/"

let GENERATESESSION = URL_SERVER_3009 + "/api/telehealth/socket/generateSession"

let TELEAPPOINTMENT_DETAIL = URL_SERVER_3009 + "/api/telehealth/user/telehealthAppointmentDetails/"

let WAAPPOINTMENT_DETAIL = URL_SERVER_3009 + "/api/telehealth/user/WAAppointmentDetails/"

let APPOINTMENTLIST = URL_SERVER_3009 + "/api/telehealth/appointment/list"

let APPOINTMENTLIST_TeleHealth = URL_SERVER_3009 + "/api/telehealth/appointment/list/TEL"

let DOWNLOAD_IMAGE = URL_SERVER_3005 + "/api/downloadFile/"

let GET_NEW_TOKEN = URL_SERVER_3006 + "/api/refresh-token/GetNewToken"

let UPDATE_TOKEN_PUSH = URL_SERVER_3009 + "/api/telehealth/user/updateToken"

let PUSH_ACTION = URL_SERVER_3009 + "/api/telehealth/user/pushNotification"

/// socket emit url
let TRANSFER_IN_CALL = "/api/telehealth/socket/messageTransfer?from=%@&to=%@&message=%@"

let MAKE_CALL = "/api/telehealth/socket/messageTransfer?from=%@&to=%@&message=%@&sessionId=%@&fromName=%@"

let JOIN_ROOM = "/api/telehealth/socket/joinRoom?uid=%@"

var AUTHTOKEN = ""

/// alert message for UIAlertController
var err_Title_Network = "REDiMED Clinic Unavailable"
var err_Mess_Network = "The Internet connection appears to be offline"
var err_Mess_Connect = "Could not connect to server, please try again"

var err_Mess_sessionExpired = "Your session is expired. Please login again!"

/**
 *  check platform simulator or real device
 */
struct Platform {
    static let isSimulator: Bool = {
        var isSim = false
        #if arch(i386) || arch(x86_64)
            isSim = true
        #endif
        return isSim
    }()
}

/**
 function for format string to date with a format
 
 - parameter dateString: receive data from server
 
 - returns: A NSDate with format self regulation
 */
func FormatStrDate(dateString: String) -> String {
    let dateFormatter = NSDateFormatter()
    dateFormatter.timeZone = NSTimeZone(name: "UTC")
    dateFormatter.dateFormat = "yyyy-MM-dd'T'HH:mm:ss.000Z"
    if let datePublished = dateFormatter.dateFromString(dateString) {
        dateFormatter.dateFormat = "dd/MM/yyyy HH:mm"
        let dateFormated = dateFormatter.stringFromDate(datePublished)
        dateFormatter.timeZone = NSTimeZone(name: "UTC")
        return dateFormated
    }
    return ""
}

func getReFormat() -> (timeZone: String, filterFormat: String) {
    let date = NSDate()
    let dateFormatter = NSDateFormatter()
    dateFormatter.dateFormat = "yyyy-MM-dd ZZZ"
    let reFormatDate = dateFormatter.stringFromDate(date)
    let arrReFormatDate = reFormatDate.componentsSeparatedByString(" ")
    return (timeZone: arrReFormatDate[1], filterFormat: reFormatDate)
}

func paramFilter(offset: Int, aptFrom: String, aptTo: String) {
    SingleTon.filterParam = [ "data":
        [
            "Limit": 20,
            "Offset": offset,
            "Order": ["Appointment": ["FromTime": "DESC"]],
            "Filter": [
                [
                    "Appointment":
                        [
                            "Enable": "Y"
                    ]
                ],
                [
                    "TelehealthAppointment": ["Type": "WAA"]
                ]
            ],
            "Range" : [
                [
                    "Appointment": [
                        "FromTime": [ aptFrom, aptTo ]
                    ]
                ]
            ]
        ]
    ]
}

func get_full_name() -> String {
    if let teleDef = NSUserDefaults.standardUserDefaults().valueForKey("doctorInfo") {
        let parseJson = JSON(teleDef)
        if parseJson["FirstName"].stringValue.isEmpty && parseJson["LastName"].stringValue.isEmpty {
            SingleTon.nameLogin = "Doctor"
        } else {
            SingleTon.nameLogin = "\(parseJson["FirstName"].stringValue) \(parseJson["LastName"].stringValue)"
        }
    }
    return SingleTon.nameLogin!
}



