<?php 
    if(isset($_POST['Submit'])) {

        #$logins = array('Test' => '123456');
        $logins = array(); #holds login info

        $acc_file =  fopen("user_database/user_account.txt","r"); #open file containing account information

        /*Read through file line by line and build associative array with the contents */
        if($acc_file) { 
            while (($line = fgets($acc_file))  !== false) {

                $info = explode(',', $line); #Separate each line
                /*
                $info[0] = username
                $info[1] = email
                $info[2] = password
                */ 
                $logins[$info[0]] = $info[2]; #add credentials to associative array
            }
        }

        /* Check and assign submitted Username and Password to new variable */
        $Username = isset($_POST['username']) ? $_POST['username'] : '';
        $Password = isset($_POST['password']) ? $_POST['password'] : '';
        

    #Check if credentials are in logins array
    if(array_key_exists($Username, $logins) && trim($logins[$Username]) == trim($Password)) { #Credentials are found
        
        //header("location:level_difficulty.php"); #goto index.php
		header("location:game.html"); #goto game.html
        exit(); #end php script
    } else {
        print("credentials not found in array<br>");
    }
}
?>

<?php include 'common/common-meta-header.php'; ?>

<!--
<div class="icon">
    <img src="images/LogIn.JPG">
</div>
-->
<div>
    <img class="title_img" src="./images/Title.JPG" alt="image">
</div>

    <form class="input" method="POST" name="login_form" id="input_form">
        <fieldset>
            <legend class="legend_txt">Login</legend>
            <table> <!-- This table will contain the fields for the form-->

                <!--Username label & textfield row-->
                <tr> 
                    <td>
                        <label>Username:</label>
                    </td>
                    <td>
                        <input name="username" type="text" size="16" placeholder="Username">
                    </td>
                </tr>

                <!--Password label & textfield row-->
                <tr>
                    <td>
                        <label>Password:</label>
                    </td>

                    <td>
                        <input type="password" name="password" size="16" placeholder="Password">
                    </td>

                </tr>


                <!--Submit button row-->
                <tr class="centered">
                    <td colspan="2" class="centered">
                        <input name="Submit" type="submit" value="Login" id="submit-btn">
                    </td>

                </tr>

                <!--Goto signup page row-->
                <tr>
                    <td colspan="2" class="centered">
                        <a href="./signup.php"> Don't have an account? Sign up!</a>
                    </td>

                </tr>
            </table>
        </fieldset>
    </form>

<!-- shared page bottom HTML -->
<?php include 'common/common-footer.php'; ?>