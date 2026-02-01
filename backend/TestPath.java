import java.nio.file.Path;
import java.nio.file.Paths;
public class TestPath {
    public static void main(String[] args) {
        Path p = Paths.get("").toAbsolutePath().normalize();
        System.out.println("Current path: " + p);
        System.out.println("Ends with backend: " + p.endsWith("backend"));
        String pathStr = p.toString();
        System.out.println("Contains \\backend: " + pathStr.contains("\\backend"));
        System.out.println("Contains /backend: " + pathStr.contains("/backend"));
        if (p.endsWith("backend")) {
            System.out.println("Parent: " + p.getParent());
        }
    }
}
