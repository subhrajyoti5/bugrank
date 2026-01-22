// Sample buggy Java code - Null Pointer Exception
const String buggyCode = """
public class Main {
    public static void main(String[] args) {
        String text = null;
        
        // Bug: NullPointerException - checking null after use
        System.out.println(text.length());
        
        if (text != null) {
            System.out.println("Text is: " + text);
        }
    }
}
""";
