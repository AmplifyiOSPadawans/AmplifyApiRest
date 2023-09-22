//
//  ViewController.swift
//  AmplifyApiRest
//
//  Created by David Perez Espino on 21/09/23.
//

import UIKit

class ViewController: UIViewController {

    @IBOutlet weak var txtFldReleaseDate: UITextField!
    @IBOutlet weak var txtFldGender: UITextField!
    @IBOutlet weak var txtFldTitle: UITextField!
    @IBOutlet weak var txtFldAuthor: UITextField!
    
    @IBOutlet weak var lblBooksList: UILabel!
    
    let api = ApiHelper()
    
    override func viewDidLoad() {
        super.viewDidLoad()
        lblBooksList.numberOfLines = 0
    }
    
    @IBAction func addBook(_ sender: UIButton) {
        
        Task {
            let newBook = Book(
                author: txtFldAuthor.text ?? "",
                title: txtFldTitle.text ?? "",
                gender: txtFldGender.text ?? "",
                release_date: txtFldReleaseDate.text ?? ""
            )
            
            let result = await api.postBook(book: newBook)
            
            if result {
                showMessage("Book added")
            } else {
                showMessage("Something went wrong")
            }
        }
        
    }
    
    @IBAction func showBooks(_ sender: UIButton) {
        
    }
    
    func showMessage(_ message: String) {
        let alert = UIAlertController(title: "Alert", message: message, preferredStyle: .alert)
        alert.addAction(UIAlertAction(title: "Ok", style: .default, handler: nil))
        self.present(alert, animated: true, completion: nil)
    }


}

