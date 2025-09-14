import 'dart:convert';
import 'package:http/http.dart' as http;

class ApiService {
  // Use your computer's local network IP address.
  final String _baseUrl = "http://192.168.40.132:5001/api";

  // This function now calls the correct endpoint for operators only
  Future<List<dynamic>> getAllOperators() async {
    final response = await http.get(Uri.parse('$_baseUrl/operators'));

    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    } else {
      throw Exception('Failed to load operators');
    }
  }

  // --- TOOL METHODS ---

  Future<List<dynamic>> getTools() async {
    final response = await http.get(Uri.parse('$_baseUrl/tools'));
    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    } else {
      throw Exception('Failed to load tools');
    }
  }

  Future<Map<String, dynamic>> addTool(
      String name, String serialNumber, String category) async {
    final response = await http.post(
      Uri.parse('$_baseUrl/tools'),
      headers: {'Content-Type': 'application/json; charset=UTF-8'},
      body: jsonEncode({
        'name': name,
        'serial_number': serialNumber,
        'category': category,
      }),
    );
    if (response.statusCode == 201) {
      return jsonDecode(response.body);
    } else {
      throw Exception('Failed to add tool.');
    }
  }

  Future<String> issueTool(
      String toolId, String conditionOnIssue, String operatorId) async {
    final response = await http.post(
      Uri.parse('$_baseUrl/tools/issue'),
      headers: {'Content-Type': 'application/json; charset=UTF-8'},
      body: jsonEncode({
        'toolId': toolId,
        'condition_on_issue': conditionOnIssue,
        'operatorId': operatorId,
      }),
    );
    if (response.statusCode == 200) {
      return jsonDecode(response.body)['message'];
    } else {
      throw Exception('Failed to issue tool.');
    }
  }
}
