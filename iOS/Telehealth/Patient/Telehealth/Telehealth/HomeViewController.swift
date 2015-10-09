//
//  HomeViewController.swift
//  Telehealth
//
//  Created by Giap Vo Duc on 9/22/15.
//  Copyright © 2015 Giap Vo Duc. All rights reserved.
//

import UIKit
import Socket_IO_Client_Swift
import SwiftyJSON

class HomeViewController: UIViewController,UIPopoverPresentationControllerDelegate{
    var uid = String()
    
    override func viewDidLoad() {
        super.viewDidLoad()
        //Get uuid user in locacalstorage
        if let uuid = defaults.valueForKey("UserInformation") as? String {
            uid = uuid
        }
       
    }
    
    override func viewWillAppear(animated: Bool) {
        dispatch_async(dispatch_get_main_queue(), { () -> Void in
            // Called on every event
            sharedSocket.socket.onAny {
                print("got event: \($0.event) with items \($0.items)")
            }
            // Socket Events
            sharedSocket.socket.on("connect") {data, ack in
                print("socket connected")
                print("\(self.uid)")
                let modifieldURLString = NSString(format: UrlAPISocket.joinRoom.rawValue, self.uid) as String
                let dictionNary : NSDictionary = ["url": modifieldURLString]
                sharedSocket.socket.emit("get", dictionNary)
            }
            
            sharedSocket.socket.on("receiveMessage"){data, ack in
                
                let dataCalling = JSON(data)
                //save data to temp class
                savedData = saveData(data: dataCalling)
                self.AnswerCall()
                
                
                
            }
        })
        //Socket connecting
        sharedSocket.socket.connect()
        
    }
    

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        
    }
    //Giap: Change view AnswerCall by StoryboardID
    func AnswerCall(){
        let answerCall = storyboard?.instantiateViewControllerWithIdentifier("AnswerCallStoryBoard") as! AnswerCallViewController
        presentViewController(answerCall, animated: true, completion: nil)

    }
    
    

   


 

}
